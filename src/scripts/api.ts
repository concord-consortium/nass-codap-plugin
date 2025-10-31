import {
  codapInterface,
  createDataContext,
  getDataContext,
  createParentCollection,
  createChildCollection,
  createItems,
  createTable,
} from "@concord-consortium/codap-plugin-api";
import { Attribute, GeographicLevel, ICropCategory, ICropDataItem, ILivestockCategory, ILivestockDataItem, ISetReqCount, IStateOptions } from "../constants/types";
import { multiRegions } from "../constants/regionData";
import { cropOptions, livestockOptions, fiftyStates } from "../constants/constants";
import { countyData } from "../constants/counties";
import { getQueryParams } from "./utils";
import { acresOperatedAttributes, attrToCODAPColumnName, economicClassAttirbutes } from "../constants/codapMetadata";
import { strings } from "../constants/strings";

const baseURL = process.env.REACT_APP_NASS_PROXY_URL;

if (!baseURL) {
  throw new Error("API Base URL not defined");
}

const dataSetName = "NASS Quickstats Data";

interface IGetAttrDataParams {
  attribute: string,
  geographicLevel: string,
  cropUnits?: keyof ICropDataItem,
  livestockUnits?: keyof ILivestockDataItem,
  years: Array<string>,
  states: Array<string>
}

interface IAcreTotals {
  [key: string]: {
    [key: string]: number | null
  }
}

export const createRequest = ({attribute, geographicLevel, years, states, cropUnits, livestockUnits}: IGetAttrDataParams) => {
  const queryParams = getQueryParams(attribute);

  if (!queryParams) {
    throw new Error("Invalid attribute");
  }

  const {
    sect_desc,
    group_desc,
    commodity_desc,
    statisticcat_desc,
    domain_desc,
    short_desc,
  } = queryParams;

  const item = cropUnits
    ? (queryParams?.short_desc as ICropDataItem)[cropUnits]
    : livestockUnits
      ? (queryParams?.short_desc as ILivestockDataItem)[livestockUnits]
      : short_desc as string[];

  // For livestock, extract the base category (e.g., "Inventory" from "Inventory, Broilers")
  const livestockBaseCategory = livestockUnits ? livestockUnits.split(",")[0].trim() as keyof ILivestockCategory : undefined;
  
  const cat = cropUnits
    ? (queryParams?.statisticcat_desc as ICropCategory)[cropUnits]
    : livestockBaseCategory
      ? (queryParams?.statisticcat_desc as ILivestockCategory)[livestockBaseCategory]
      : statisticcat_desc;

  let req = "";
  if (attribute === "Total Farmers" && years.every(year => parseInt(year, 10) < 2017)) {
    // we need to custom-build the req for years before 2017
    req = `${baseURL}?` +
    `sect_desc=${encodeURIComponent("DEMOGRAPHICS")}` +
    `&group_desc=${encodeURIComponent("OPERATORS")}` +
    `&commodity_desc=${encodeURIComponent("OPERATORS")}` +
    `&statisticcat_desc=${encodeURIComponent("OPERATORS")}` +
    `&domain_desc=${encodeURIComponent("TOTAL")}` +
    `&agg_level_desc=${encodeURIComponent(geographicLevel)}` +
    `&short_desc=${encodeURIComponent("OPERATORS, (ALL) - NUMBER OF OPERATORS")}`;
  } else {
    req = `${baseURL}?` +
    `sect_desc=${encodeURIComponent(sect_desc)}` +
    `&group_desc=${encodeURIComponent(group_desc)}` +
    `&commodity_desc=${encodeURIComponent(commodity_desc)}` +
    `&statisticcat_desc=${encodeURIComponent(cat as string)}` +
    `&domain_desc=${encodeURIComponent(domain_desc)}` +
    `&agg_level_desc=${encodeURIComponent(geographicLevel)}`;
  }

  years.forEach((year) => {
    req = req + `&year=${year}`;
  });

  if (geographicLevel !== "National") {
    states.forEach((state) => {
      if (geographicLevel === "REGION : MULTI-STATE") {
        if (state !== "Alaska") {
          const region = multiRegions.find((r) => r.States.includes(state));
          req = req + `&region_desc=${encodeURIComponent(region?.Region as string)}`;
        }
      } else {
        req = req + `&state_name=${encodeURIComponent(state)}`;
      }
    });
  }

  const itemArray = Array.isArray(item) ? item : [item];
  itemArray.forEach(subItem => {
    if (subItem) {
      req = req + `&short_desc=${encodeURIComponent(subItem)}`;
    }
  });

  if (geographicLevel === "REGION : MULTI-STATE") {
    req = req + `&freq_desc=ANNUAL`;
  }

  return req;
};

export const getAllAttrs = (selectedOptions: IStateOptions) => {
  const {geographicLevel, states, cropUnits, livestockUnits, years, ...subOptions} = selectedOptions;
  const allAttrs: Array<Attribute> = [{"name": "Year"}, {"name": geographicLevel}, {"name": `${geographicLevel} Boundary`}];

  for (const key in subOptions) {
    const selections = subOptions[key as keyof typeof subOptions];
    for (const attribute of selections) {
      const queryParams = getQueryParams(attribute);
      if (!queryParams) {
        throw new Error("Invalid attribute");
      }
      const {short_desc} = queryParams;
      if (attribute === "Economic Class") {
        for (const econAttr of economicClassAttirbutes) {
          const codapColumnName = attrToCODAPColumnName[econAttr].attributeNameInCodapTable;
          const codapColumnUnit = attrToCODAPColumnName[econAttr].unitInCodapTable;
          allAttrs.push({"name": codapColumnName, "unit": codapColumnUnit});
        }
      } else if (attribute === "Acres Operated") {
        for (const acresAttr of acresOperatedAttributes) {
          const codapColumnName = attrToCODAPColumnName[acresAttr].attributeNameInCodapTable;
          const codapColumnUnit = attrToCODAPColumnName[acresAttr].unitInCodapTable;
          allAttrs.push({"name": codapColumnName, "unit": codapColumnUnit});
        }
      } else if (Array.isArray(short_desc)) {
        for (const desc of short_desc) {
          const codapColumnName = attrToCODAPColumnName[desc].attributeNameInCodapTable;
          const codapColumnUnit = attrToCODAPColumnName[desc].unitInCodapTable;
          allAttrs.push({"name": codapColumnName, "unit": codapColumnUnit});
        }
      } else if (typeof short_desc === "object" && cropUnits.length && cropOptions.options.includes(attribute)) {
        cropUnits.forEach((cropUnit) => {
          const attr = (short_desc as ICropDataItem)[cropUnit as keyof ICropDataItem][0];
          const codapColumnName = attrToCODAPColumnName[attr].attributeNameInCodapTable;
          const codapColumnUnit = attrToCODAPColumnName[attr].unitInCodapTable;
          allAttrs.push({"name": codapColumnName, "unit": codapColumnUnit});
        });
      } else if (typeof short_desc === "object" && livestockUnits && livestockUnits.length && livestockOptions.options.includes(attribute)) {
        // Special case for Chickens: create separate Broilers and Layers inventory columns
        if (attribute === "Chickens") {
          const broilersArray = (short_desc as ILivestockDataItem)["Inventory, Broilers"];
          const layersArray = (short_desc as ILivestockDataItem)["Inventory, Layers"];
          
          if (broilersArray && broilersArray.length > 0) {
            const broilersAttr = broilersArray[0];
            const codapColumnName = attrToCODAPColumnName[broilersAttr].attributeNameInCodapTable;
            const codapColumnUnit = attrToCODAPColumnName[broilersAttr].unitInCodapTable;
            allAttrs.push({"name": codapColumnName, "unit": codapColumnUnit});
          }
          
          if (layersArray && layersArray.length > 0) {
            const layersAttr = layersArray[0];
            const codapColumnName = attrToCODAPColumnName[layersAttr].attributeNameInCodapTable;
            const codapColumnUnit = attrToCODAPColumnName[layersAttr].unitInCodapTable;
            allAttrs.push({"name": codapColumnName, "unit": codapColumnUnit});
          }
        } else {
          // Standard livestock handling
          livestockUnits.forEach((livestockUnit) => {
            const livestockArray = (short_desc as ILivestockDataItem)[livestockUnit as keyof ILivestockDataItem];
            if (livestockArray && livestockArray.length > 0) {
              const attr = livestockArray[0];
              const codapColumnName = attrToCODAPColumnName[attr].attributeNameInCodapTable;
              const codapColumnUnit = attrToCODAPColumnName[attr].unitInCodapTable;
              allAttrs.push({"name": codapColumnName, "unit": codapColumnUnit});
            }
          });
        }
      }
    }
  }
  return allAttrs;
};

const deleteOldDataContext = async () => {
  return codapInterface.sendRequest({
    action: "delete",
    resource: `dataContext[${dataSetName}]`
  });
};

const getNewDataContext = async () => {
  const doesDataContextExist = await getDataContext(dataSetName);
  if (doesDataContextExist.success) {
    await deleteOldDataContext();
  }
  await createDataContext(dataSetName);
};

const makeCODAPAttributeDef = (attr: Attribute, geoLevel: GeographicLevel) => {
  const {name, unit} = attr;
  if (attr.name.includes("Boundary")) {
    const formula = geoLevel === "County" ? `lookupBoundary(US_county_boundaries, County + ', ' + State)`
    : `lookupBoundary(US_state_boundaries, State)`;
    return {
      name,
      type: "boundary",
      formula
    };
  } else {
    return {
      name,
      unit,
      type: name === "State" || name === "County" ? "categorical" : "numeric"
    };
  }
};

const createStateCollection = async () => {
  const attrs: Array<Attribute> = [{"name": "State"}];
  const boundaryDef = makeCODAPAttributeDef({"name": "State Boundary"}, "State");
  attrs.push(boundaryDef);
  await createParentCollection(dataSetName, "States", attrs);
};

const createSubCollection = async (geoLevel: GeographicLevel, attrs: Array<Attribute>) => {
  const attrDefs = attrs.map((attr) => makeCODAPAttributeDef(attr, geoLevel));
  await createChildCollection(dataSetName, "Data", "States", attrDefs);
};

export const createTableFromSelections = async (selectedOptions: IStateOptions, setReqCount: ISetReqCount) => {
  const {geographicLevel} = selectedOptions;

  try {
    const allAttrs = getAllAttrs(selectedOptions);
    const items = await getItems(selectedOptions, setReqCount);
    await getNewDataContext();
    if (geographicLevel === "County") {
      await createStateCollection();
      await createSubCollection(geographicLevel, allAttrs);
      await createItems(dataSetName, items);
      await createTable(dataSetName, dataSetName);
      return "success";
    } else {
      const attrDefinitions = allAttrs.map((attr) => makeCODAPAttributeDef(attr, geographicLevel));
      await createParentCollection(dataSetName, "Data", attrDefinitions);
      await createItems(dataSetName, items);
      await createTable(dataSetName, dataSetName);
      return "success";
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("Error creating CODAP Table from API data:", error);
    return error;
  }
};

interface IPrepareQueryAndFetchData {
  isMultiStateRegion: boolean,
  years: string[],
  geographicLevel: GeographicLevel,
  queryParams: any,
  attribute: string,
  stateArray: string[],
  cropUnit?: string,
  selectedOptions: IStateOptions,
  setReqCount: ISetReqCount
}

const prepareQueryAndFetchData = async (props: IPrepareQueryAndFetchData) => {
  const {isMultiStateRegion, years, geographicLevel, queryParams, stateArray, attribute, cropUnit, selectedOptions, setReqCount} = props;
  const geoLevel = isMultiStateRegion ? "REGION : MULTI-STATE" : geographicLevel;
  const yearsAvailable = years.filter(year => queryParams?.years[geographicLevel].includes(year));
  if (yearsAvailable.length) {
    const params: IGetAttrDataParams = {attribute, geographicLevel: geoLevel, years: yearsAvailable, states: stateArray};
    if (cropOptions.options.includes(attribute) && cropUnit) {
      params.cropUnits = cropUnit as keyof ICropDataItem;
    }
    if (livestockOptions.options.includes(attribute) && cropUnit) {
      params.livestockUnits = cropUnit as keyof ILivestockDataItem;
    }
    const data = await getAttrData(params, selectedOptions, setReqCount);
    return data;
  }
};

interface IFindMatchingData {
  isMultiStateRegion: boolean,
  data: any,
  item: any,
  geoLevel: GeographicLevel

}

const findMatchingData = (props: IFindMatchingData) => {
  const {isMultiStateRegion, data, item, geoLevel} = props;
  const matchingData = data.filter((dataObj: any) => {
    if (isMultiStateRegion) {
      const {region_desc, year} = dataObj;
      const regionThatIncludesState = multiRegions.find((r) => r.States.includes(item.State));
      return regionThatIncludesState?.Region.toLowerCase() === region_desc.toLowerCase() && year === Number(item.Year);
    } else {
      const {state_name, year} = dataObj;
      const lowerItemState = item.State.toLowerCase();
      const lowerDataState = state_name.toLowerCase();
      let isSameGeoLevel;
      if (geoLevel === "County") {
        const lowerItemCounty = item.County.toLowerCase();
        const lowerDataCounty = dataObj.county_name.toLowerCase();
        isSameGeoLevel = lowerItemCounty === lowerDataCounty && lowerItemState === lowerDataState;
      } else {
        isSameGeoLevel = lowerItemState === lowerDataState;
      }
      return isSameGeoLevel && Number(item.Year) === year;
    }
  });
  return matchingData;
};

interface IProcessAttributeData {
  attribute: string,
  items: any,
  geographicLevel: GeographicLevel,
  years: string[],
  cropUnit: string,
  selectedOptions: IStateOptions,
  setReqCount: ISetReqCount,
  stateArray: string[]
}

const processAttributeData = async (props: IProcessAttributeData) => {
  const {attribute, items, geographicLevel, years, cropUnit, selectedOptions, setReqCount, stateArray} = props;
  const queryParams = getQueryParams(attribute);
  const isMultiStateRegion = queryParams?.geographicAreas[0] === "REGION : MULTI-STATE";
  const data = await prepareQueryAndFetchData({isMultiStateRegion, years, geographicLevel, queryParams, attribute, stateArray, cropUnit, selectedOptions, setReqCount});

  // there might be no data returned for the year/attribute/geoLevel combination, in which case we return items unchanged
  if (data) {
    items.forEach((item: any) => {
      // find all the data items that match this item's location and year
      const matchingData = findMatchingData({isMultiStateRegion, data, item, geoLevel: geographicLevel});
      if (matchingData.length) {
        if (isMultiStateRegion) {
            const { Value } = matchingData[0];
            const codapColumnName = attrToCODAPColumnName[matchingData[0].short_desc].attributeNameInCodapTable;
            item[codapColumnName] = Value;
        } else if (attribute === "Acres Operated") {
          // special case for handling acres operated, where we have to sum up the values of several data items
          const acreTotals: IAcreTotals = {
            [strings.oneTo9Acres]: {
              [strings.oneTo9Acres]: 0
            },
            [strings.tenTo49Acres]: {
              [strings.tenTo49Acres]: 0
            },
            [strings.fiftyTo100Acres]: {
              [strings.fiftyTo69Acres]: 0,
              [strings.seventyTo99Acres]: 0
            },
            [strings.oneHundredTo500Acres]: {
              [strings.oneHundredTo139Acres]: 0,
              [strings.oneHundredFortyTo179Acres]: 0,
              [strings.oneHundredEightyTo219Acres]: 0,
              [strings.twoHundredTwentyTo259Acres]: 0,
              [strings.twoHundredSixtyTo499Acres]: 0
            },
            [strings.fiveHundredTo999Acres]: {
              [strings.fiveHundredTo999Acres]: 0
            },
            [strings.oneThousandTo5000Acres]: {
              [strings.oneThousandTo1999Acres]: 0,
              [strings.twoThousandTo4999Acres]: 0
            },
            [strings.fiveThousandOrMoreAcres]: {
              [strings.fiveThousandOrMoreAcres]: 0
            }
          };
          const totalKeys = Object.keys(acreTotals);
          for (const total of totalKeys) {
            const subTotalKeys = Object.keys(acreTotals[total]);
            const subTotalData = matchingData.filter((dataItem: any) => subTotalKeys.includes(dataItem.domaincat_desc));
            subTotalData.forEach((dataObj: any) => {
              acreTotals[total][dataObj.domaincat_desc] = dataObj.Value.replace(/,/g, "");
            });
            const codapColumnName = attrToCODAPColumnName[total].attributeNameInCodapTable;
            // sum up all the values of acreTotals[total]
            const onlyNumbers = subTotalKeys.map((k) => Number(acreTotals[total][k]));
            const sum = onlyNumbers.reduce((acc, cur) => acc + cur);
            item[codapColumnName] = sum;
          }
        } else {
          matchingData.forEach((dataItem: any) => {
            const dataItemDesc = attribute === "Economic Class" ? dataItem.domaincat_desc : dataItem.short_desc;
            const codapColumnName = attrToCODAPColumnName[dataItemDesc]?.attributeNameInCodapTable;
            if (codapColumnName) {
              item[codapColumnName] = dataItem.Value;
            }
          });
        }
      }

    });
  }
  return items;
};

const getItems = async (selectedOptions: IStateOptions, setReqCount: ISetReqCount) => {
  const {geographicLevel, states, years, cropUnits, livestockUnits, ...subOptions} = selectedOptions;
  const items: any = [];
  const stateArray = states[0] === "All States" ? fiftyStates : states;

  stateArray.forEach((state: string) => {
    years.forEach((year: string) => {
      if (geographicLevel === "County") {
        const countyDataForState = countyData[state];
          countyDataForState.forEach((county: string) => {
            items.push({County: county, State: state, Year: year});
          });
      } else {
        items.push({State: state, Year: year});
      }
    });
  });

  const subOptionsKeys = Object.keys(subOptions);
  const numAttributes = subOptionsKeys.reduce((acc, cur) => acc + subOptions[cur as keyof typeof subOptions].length, 0);
  setReqCount((prevState) => { return {...prevState, total: numAttributes };});

  for (const key in subOptions) {
    const value = subOptions[key as keyof typeof subOptions];
    for (const attribute of value) {
      const isCropAttribute = cropOptions.options.includes(attribute);
      const isLivestockAttribute = livestockOptions.options.includes(attribute);
      
      if (isCropAttribute && cropUnits.length > 1) {
        for (const cropUnit of cropUnits) {
          await processAttributeData({attribute, items, geographicLevel, years, cropUnit, selectedOptions, setReqCount, stateArray});
        }
      } else if (isCropAttribute && cropUnits.length === 1) {
        await processAttributeData({attribute, items, geographicLevel, years, cropUnit: cropUnits[0], selectedOptions, setReqCount, stateArray});
      } else if (isLivestockAttribute && attribute === "Chickens") {
        // Special case for Chickens: always fetch both Broilers and Layers
        await processAttributeData({attribute, items, geographicLevel, years, cropUnit: "Inventory, Broilers", selectedOptions, setReqCount, stateArray});
        await processAttributeData({attribute, items, geographicLevel, years, cropUnit: "Inventory, Layers", selectedOptions, setReqCount, stateArray});
      } else if (isLivestockAttribute && livestockUnits && livestockUnits.length > 1) {
        for (const livestockUnit of livestockUnits) {
          await processAttributeData({attribute, items, geographicLevel, years, cropUnit: livestockUnit, selectedOptions, setReqCount, stateArray});
        }
      } else if (isLivestockAttribute && livestockUnits && livestockUnits.length === 1) {
        await processAttributeData({attribute, items, geographicLevel, years, cropUnit: livestockUnits[0], selectedOptions, setReqCount, stateArray});
      } else {
        await processAttributeData({attribute, items, geographicLevel, years, cropUnit: "", selectedOptions, setReqCount, stateArray});
      }
    }
  }

  return items;
};


const getAttrData = async (params: IGetAttrDataParams, selectedOptions: IStateOptions, setReqCount: ISetReqCount) => {
  const {attribute, geographicLevel, cropUnits, livestockUnits, years, states} = params;
  const reqParams: IGetAttrDataParams = {attribute, geographicLevel, years, states};
  if (cropOptions.options.includes(attribute) && cropUnits) {
    reqParams.cropUnits = cropUnits;
  }
  if (livestockOptions.options.includes(attribute) && livestockUnits) {
    reqParams.livestockUnits = livestockUnits;
  }
  const req = createRequest(reqParams);
  if (attribute === "Total Farmers" && years.length > 1 && 
      years.some(year => parseInt(year, 10) < 2017) && 
      years.some(year => parseInt(year, 10) >= 2017)) {
    // we need to make two requests -- one for pre-2017 years, and one for 2017+ years
    const pre2017Years = years.filter(year => parseInt(year, 10) < 2017);
    const post2017Years = years.filter(year => parseInt(year, 10) >= 2017);
    const reqPre2017 = createRequest({...reqParams, years: pre2017Years});
    const reqPost2017 = createRequest({...reqParams, years: post2017Years});
    const resPre2017 = await fetchDataWithRetry(reqPre2017, setReqCount);
    const resPost2017 = await fetchDataWithRetry(reqPost2017, setReqCount);
    if (resPre2017 && resPost2017) {
      return [...resPre2017.data, ...resPost2017.data];
    } else {
      // eslint-disable-next-line no-console
      console.log(`No data returned for ${attribute} at ${geographicLevel} level in ${years} for ${states}`);
      return undefined;
    }
  } else {
    const res = await fetchDataWithRetry(req, setReqCount);
    if (res) {
      return res.data;
    } else {
      // eslint-disable-next-line no-console
      console.log(`No data returned for ${attribute} at ${geographicLevel} level in ${years} for ${states}`);
      return undefined;
    }
  }
};

export const fetchDataWithRetry = async (req: string, setReqCount: ISetReqCount, maxRetries = 3,) => {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      const requestUrl = req.includes("format=") ? req : `${req}&format=JSON`;
      
      const response = await fetch(requestUrl, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const json = await response.json();
      setReqCount((prevState) => {
        const completed = prevState.completed + 1 > prevState.total ? prevState.total : prevState.completed + 1;
        return {...prevState, completed};
      });
      return json;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("Error fetching data:", error);
      retries++;
      
      // Add exponential backoff delay before retrying
      if (retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      }
    }
  }
  return undefined;
};
