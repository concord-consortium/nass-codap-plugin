import fetchJsonp from "fetch-jsonp";
import {
  codapInterface,
  createDataContext,
  getDataContext,
  createParentCollection,
  createChildCollection,
  createItems,
  createTable,
} from "@concord-consortium/codap-plugin-api";
import { Attribute, GeographicLevel, ICropCategory, ICropDataItem, ISetReqCount, IStateOptions } from "../constants/types";
import { multiRegions } from "../constants/regionData";
import { cropOptions, fiftyStates } from "../constants/constants";
import { countyData } from "../constants/counties";
import { getQueryParams } from "./utils";
import { acresOperatedAttributes, attrToCODAPColumnName, economicClassAttirbutes } from "../constants/codapMetadata";
import { strings } from "../constants/strings";

const baseURL = `https://quickstats.nass.usda.gov/api/api_GET/?key=9ED0BFB8-8DDD-3609-9940-A2341ED6A9E3`;

const dataSetName = "NASS Quickstats Data";

interface IGetAttrDataParams {
  attribute: string,
  geographicLevel: string,
  cropUnits?: keyof ICropDataItem,
  years: Array<string>,
  states: Array<string>
}

interface IAcreTotals {
  [key: string]: {
    [key: string]: number | null
  }
}

export const createRequest = ({attribute, geographicLevel, years, states, cropUnits}: IGetAttrDataParams) => {
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

  const item = cropUnits ?
  (queryParams?.short_desc as ICropDataItem)[cropUnits] :
  short_desc as string[];
const cat = cropUnits ?
  (queryParams?.statisticcat_desc as ICropCategory)[cropUnits] :
  statisticcat_desc;

  let req = "";
  if (attribute === "Total Farmers" && !years.includes("2017")) {
    // we need to custom-build the req in this one case
    req = `${baseURL}` +
    `&sect_desc=${encodeURIComponent("DEMOGRAPHICS")}` +
    `&group_desc=${encodeURIComponent("OPERATORS")}` +
    `&commodity_desc=${encodeURIComponent("OPERATORS")}` +
    `&statisticcat_desc=${encodeURIComponent("OPERATORS")}` +
    `&domain_desc=${encodeURIComponent("TOTAL")}` +
    `&agg_level_desc=${encodeURIComponent(geographicLevel)}` +
    `&short_desc=${encodeURIComponent("OPERATORS, (ALL) - NUMBER OF OPERATORS")}`;
  } else {
    req = `${baseURL}` +
    `&sect_desc=${encodeURIComponent(sect_desc)}` +
    `&group_desc=${encodeURIComponent(group_desc)}` +
    `&commodity_desc=${encodeURIComponent(commodity_desc)}` +
    `&statisticcat_desc=${encodeURIComponent(cat as string)}` +
    `&domain_desc=${encodeURIComponent(domain_desc)}` +
    `&agg_level_desc=${encodeURIComponent(geographicLevel)}`;
  }

  years.forEach((year) => {
    req = req + `&year=${year}`;
  });

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

  item.forEach(subItem => {
    req = req + `&short_desc=${encodeURIComponent(subItem)}`;
  });

  if (geographicLevel === "REGION : MULTI-STATE") {
    req = req + `&freq_desc=ANNUAL`;
  }

  return req;
};

export const getAllAttrs = (selectedOptions: IStateOptions) => {
  const {geographicLevel, states, cropUnits, years, ...subOptions} = selectedOptions;
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
      } else if (typeof short_desc === "object" && cropUnits.length) {
        cropUnits.forEach((cropUnit) => {
          const attr = short_desc[cropUnit as keyof ICropDataItem][0];
          const codapColumnName = attrToCODAPColumnName[attr].attributeNameInCodapTable;
          const codapColumnUnit = attrToCODAPColumnName[attr].unitInCodapTable;
          allAttrs.push({"name": codapColumnName, "unit": codapColumnUnit});
        });
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
      formula,
      formulaDependents: "State"
    };
  } else {
    return {
      name,
      unit,
      type: name === "State" || name === "County" ? "string" : "numeric"
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
  const {geographicLevel, states, years, cropUnits, ...subOptions} = selectedOptions;
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
    if (cropUnits.length > 1) {
      for (const cropUnit of cropUnits) {
        for (const attribute of value) {
          await processAttributeData({attribute, items, geographicLevel, years, cropUnit, selectedOptions, setReqCount, stateArray});
        }
      }
    } else {
      for (const attribute of value) {
        await processAttributeData({attribute, items, geographicLevel, years, cropUnit: cropUnits[0], selectedOptions, setReqCount, stateArray});
      }
    }
  }

  return items;
};


const getAttrData = async (params: IGetAttrDataParams, selectedOptions: IStateOptions, setReqCount: ISetReqCount) => {
  const {attribute, geographicLevel, cropUnits, years, states} = params;
  const reqParams: IGetAttrDataParams = {attribute, geographicLevel, years, states};
  if (cropOptions.options.includes(attribute) && cropUnits) {
    reqParams.cropUnits = cropUnits;
  }
  const req = createRequest(reqParams);
  if (attribute === "Total Farmers" && (years.length > 1 && years.includes("2017"))) {
    // we need to make two requests -- one for the total farmers in 2017, and one for the total farmers in all other years
    const req2017 = createRequest({...reqParams, years: ["2017"]});
    const reqOtherYears = createRequest({...reqParams, years: years.filter((year) => year !== "2017")});
    const res2017 = await fetchDataWithRetry(req2017, setReqCount);
    const resOtherYears = await fetchDataWithRetry(reqOtherYears, setReqCount);
    if (res2017 && resOtherYears) {
      return [...res2017.data, ...resOtherYears.data];
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
      const response = await fetchJsonp(req, { timeout: 10000 }); // Increase the timeout
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
    }
  }
  return undefined;
};
