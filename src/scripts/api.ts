import fetchJsonp from "fetch-jsonp";
import { ICropCategory, ICropDataItem, ISetReqCount, IStateOptions } from "../constants/types";
import { multiRegions } from "../constants/regionData";
import { connect } from "./connect";
import { cropOptions, fiftyStates } from "../constants/constants";
import { countyData } from "../constants/counties";
import { flatten, getQueryParams } from "./utils";
import { acresOperatedAttributes, attrToCODAPColumnName, economicClassAttirbutes } from "../constants/codapMetadata";

const baseURL = `https://quickstats.nass.usda.gov/api/api_GET/?key=9ED0BFB8-8DDD-3609-9940-A2341ED6A9E3`;

interface IGetAttrDataParams {
  attribute: string,
  geographicLevel: string,
  cropUnits?: keyof ICropDataItem,
}

interface ICreateRequestParams {
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


export const createRequest = ({attribute, geographicLevel, years, states, cropUnits}: ICreateRequestParams) => {
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

  const locationHeader = geographicLevel === "REGION : MULTI-STATE" ? "region_desc" : "state_name";

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
    `&${locationHeader}=${encodeURIComponent(geographicLevel)}` +
    `&short_desc=${encodeURIComponent("OPERATORS, (ALL) - NUMBER OF OPERATORS")}`;
  } else {
    req = `${baseURL}` +
    `&sect_desc=${encodeURIComponent(sect_desc)}` +
    `&group_desc=${encodeURIComponent(group_desc)}` +
    `&commodity_desc=${encodeURIComponent(commodity_desc)}` +
    `&statisticcat_desc=${encodeURIComponent(cat as string)}` +
    `&domain_desc=${encodeURIComponent(domain_desc)}` +
    `&agg_level_desc=${encodeURIComponent(geographicLevel)}` +
    `&${locationHeader}=${encodeURIComponent(geographicLevel)}`;
  }

  years.forEach((year) => {
    req = req + `&year=${year}`;
  });

  states.forEach((state) => {
    req = req + `&state_name=${encodeURIComponent(state)}`;
  });

  item.forEach(subItem => {
    req = req + `&short_desc=${encodeURIComponent(subItem)}`;
  });

  console.log({req});
  return req;
};

export const getAllAttrs = (selectedOptions: IStateOptions) => {
  const {geographicLevel, states, cropUnits, years, ...subOptions} = selectedOptions;
  const allAttrs: Array<string|ICropDataItem> = ["Year"];

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
          allAttrs.push(codapColumnName);
        }
      } else if (attribute === "Acres Operated") {
        for (const acresAttr of acresOperatedAttributes) {
          const codapColumnName = attrToCODAPColumnName[acresAttr].attributeNameInCodapTable;
          allAttrs.push(codapColumnName);
        }
      } else if (Array.isArray(short_desc)) {
        for (const desc of short_desc) {
          const codapColumnName = attrToCODAPColumnName[desc].attributeNameInCodapTable;
          allAttrs.push(codapColumnName);
        }
      } else if (typeof short_desc === "object" && cropUnits) {
        const attr = short_desc[cropUnits as keyof ICropDataItem][0];
        allAttrs.push(attrToCODAPColumnName[attr].attributeNameInCodapTable);
      }
    }
  }
  return allAttrs;
};

export const getNumberOfItems = (selectedOptions: IStateOptions) => {
  let {states, years} = selectedOptions;
  const countySelected = selectedOptions.geographicLevel === "County";
  if (states[0] === "All States") {
    states = fiftyStates;
  }
  if (countySelected) {
    return flatten(states.map((state: string) => countyData[state])).length * years.length;
  } else {
    return states.length * years.length;
  }
};

export const createTableFromSelections = async (selectedOptions: IStateOptions, setReqCount: ISetReqCount) => {
  const {geographicLevel} = selectedOptions;
  try {
    const allAttrs = getAllAttrs(selectedOptions);
    const items = await getItems(selectedOptions, setReqCount);
    await connect.getNewDataContext();
    await connect.createStateCollection(geographicLevel === "State");
    if (geographicLevel === "County") {
      await connect.createCountyCollection();
    }
    await connect.createSubCollection(geographicLevel, allAttrs);
    await connect.createItems(items);
    await connect.makeCaseTableAppear();
    return "success";
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("Error creating CODAP Table from API data:", error);
    return error;
  }
};

const getItems = async (selectedOptions: IStateOptions, setReqCount:  ISetReqCount) => {
  let {states} = selectedOptions;

  if (states[0] === "All States") {
    states = fiftyStates;
  }

  const items = await getDataForAttribute(selectedOptions, setReqCount);
  return items;
};

const getDataForAttribute = async (selectedOptions: IStateOptions, setReqCount: ISetReqCount) => {
  const {geographicLevel, states, years, cropUnits, ...subOptions} = selectedOptions;
  const items: any = [];

  const subOptionsKeys = Object.keys(subOptions);
  const numAttributes = subOptionsKeys.reduce((acc, cur) => acc + subOptions[cur as keyof typeof subOptions].length, 0);
  setReqCount((prevState) => { return {...prevState, total: numAttributes };});

  for (const key in subOptions) {
    const value = subOptions[key as keyof typeof subOptions];
    for (const attribute of value) {
      const queryParams = getQueryParams(attribute);
      const isMultiStateRegion = queryParams?.geographicAreas[0] === "REGION : MULTI-STATE";
      const geoLevel = isMultiStateRegion ? "REGION : MULTI-STATE" : geographicLevel;
      const params: IGetAttrDataParams = {attribute, geographicLevel: geoLevel};

      if (cropOptions.options.includes(attribute) && cropUnits) {
        params.cropUnits = cropUnits as keyof ICropDataItem;
      }

      const data = await getAttrData(params, selectedOptions, setReqCount);

      data.forEach((dataItem: any) => {
        const {state_name, year} = dataItem;

        const itemAlreadyExists = items.find((item: any) => {
          const isSameGeoLevel = geographicLevel === "County" ? item.County === dataItem.county_name : item.State === state_name;
          return isSameGeoLevel && item.Year === year;
        });

        if (!itemAlreadyExists) {
          const newItem: any = {State: state_name, Year: year};
          if (geographicLevel === "County") {
            newItem.County = dataItem.county_name;
          }
          items.push(newItem);
        }
      });

      items.forEach((item: any) => {
        // find all the data items that match this item's state and year
        const matchingData = data.filter((dataItem: any) => {
          const {state_name, year} = dataItem;
          const isSameGeoLevel = geographicLevel === "County" ? item.County === dataItem.county_name : item.State === state_name;
          return isSameGeoLevel && item.Year === year;
        });
        // special case for handling acres operated, where we have to sum up the values of several data items
        if (attribute === "Acres Operated") {
          const acreTotals: IAcreTotals = {
            "AREA OPERATED: (1.0 TO 9.9 ACRES)": {
              "AREA OPERATED: (1.0 TO 9.9 ACRES)": 0
            },
            "AREA OPERATED: (10.0 TO 49.9 ACRES)": {
              "AREA OPERATED: (10.0 TO 49.9 ACRES)": 0
            },
            "AREA OPERATED: (50.0 TO 100 ACRES)": {
              "AREA OPERATED: (50.0 TO 69.9 ACRES)": 0,
              "AREA OPERATED: (70.0 TO 99.9 ACRES)": 0
            },
            "AREA OPERATED: (100 TO 500 ACRES)": {
              "AREA OPERATED: (100 TO 139 ACRES)": 0,
              "AREA OPERATED: (140 TO 179 ACRES)": 0,
              "AREA OPERATED: (180 TO 219 ACRES)": 0,
              "AREA OPERATED: (220 TO 259 ACRES)": 0,
              "AREA OPERATED: (260 TO 499 ACRES)": 0
            },
            "AREA OPERATED: (500 TO 999 ACRES)": {
              "AREA OPERATED: (500 TO 999 ACRES)": 0
            },
            "AREA OPERATED: (1,000 TO 5,000 ACRES)": {
              "AREA OPERATED: (1,000 TO 1,999 ACRES)": 0,
              "AREA OPERATED: (2,000 TO 4,999 ACRES)": 0
            },
            "AREA OPERATED: (5,000 OR MORE ACRES)": {
              "AREA OPERATED: (5,000 OR MORE ACRES)": 0
            }
          };
          const totalKeys = Object.keys(acreTotals);
          for (const total of totalKeys) {
            const subTotalKeys = Object.keys(acreTotals[total]);
            const dataItems = matchingData.filter((dataItem: any) => subTotalKeys.includes(dataItem.domaincat_desc));
            dataItems.forEach((dataItem: any) => {
              acreTotals[total][dataItem.domaincat_desc] = dataItem.Value.replace(/,/g, "");
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
            const codapColumnName = attrToCODAPColumnName[dataItemDesc].attributeNameInCodapTable;
            item[codapColumnName] = dataItem.Value;
          });
        }
      });
    }
  }
  return items;
};


const getAttrData = async (params: IGetAttrDataParams, selectedOptions: IStateOptions, setReqCount: ISetReqCount) => {
  const {attribute, geographicLevel, cropUnits} = params;
  const {states, years} = selectedOptions;
  const queryParams = getQueryParams(attribute);
  const yearsAvailable = years.filter(year => queryParams?.years[selectedOptions.geographicLevel].includes(year));
  const stateArray = states[0] === "All States" ? fiftyStates : states;

  const reqParams: ICreateRequestParams = {attribute, geographicLevel, years: yearsAvailable, states: stateArray};

  if (cropOptions.options.includes(attribute) && cropUnits) {
    reqParams.cropUnits = cropUnits;
  }

  const req = createRequest(reqParams);
  const res = await fetchDataWithRetry(req, setReqCount);

  const items: Array<any> = [];

  if (res) {
    return res.data;
  } else {
    // eslint-disable-next-line no-console
    console.log(`Error: did not receive response for this request:`, req);
  }

  return items;
};

export const fetchDataWithRetry = async (req: string, setReqCount: ISetReqCount, maxRetries = 3,) => {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      const response = await fetchJsonp(req, { timeout: 30000 }); // Increase the timeout
      const json = await response.json();
      setReqCount((prevState) => { return {...prevState, completed: prevState.completed + 1}; });
      return json;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`Request attempt ${retries + 1} failed:`, error);
      retries++;
    }
  }
  throw new Error(`Request failed after ${maxRetries} attempts`);
};
