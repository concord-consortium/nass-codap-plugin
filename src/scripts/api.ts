import fetchJsonp from "fetch-jsonp";
import { ICropCategory, ICropDataItem, IStateOptions } from "../constants/types";
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
  location: string,
  year: string
  state?: string
}

interface IAcreTotals {
  [key: string]: {
    [key: string]: number | null
  }
}

export const fetchDataWithRetry = async (req: string, maxRetries = 3) => {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      const response = await fetchJsonp(req, { timeout: 30000 }); // Increase the timeout
      const json = await response.json();
      return json;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`Request attempt ${retries + 1} failed:`, error);
      retries++;
    }
  }
  throw new Error(`Request failed after ${maxRetries} attempts`);
};

export const createRequest = ({attribute, geographicLevel, location, year, cropUnits, state}: IGetAttrDataParams) => {
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

  const locationHeader = geographicLevel === "REGION : MULTI-STATE" ? "region_desc" : geographicLevel === "County" ? "county_name" : "state_name";

  const baseReq = `${baseURL}` +
  `&sect_desc=${encodeURIComponent(sect_desc)}` +
  `&group_desc=${encodeURIComponent(group_desc)}` +
  `&commodity_desc=${encodeURIComponent(commodity_desc)}` +
  `&statisticcat_desc=${encodeURIComponent(cat as string)}` +
  `&domain_desc=${encodeURIComponent(domain_desc)}` +
  `&agg_level_desc=${encodeURIComponent(geographicLevel)}` +
  `&${locationHeader}=${encodeURIComponent(location)}` +
  `&year=${year}`;

  let req = baseReq;

  item.forEach(subItem => {
    req = req + `&short_desc=${encodeURIComponent(subItem)}`;
  });

  // hacky but we need to custom-build the req in this one case
  if (attribute === "Total Farmers" && year !== "2017") {
    req = `${baseURL}` +
    `&sect_desc=${encodeURIComponent("DEMOGRAPHICS")}` +
    `&group_desc=${encodeURIComponent("OPERATORS")}` +
    `&commodity_desc=${encodeURIComponent("OPERATORS")}` +
    `&statisticcat_desc=${encodeURIComponent("OPERATORS")}` +
    `&domain_desc=${encodeURIComponent("TOTAL")}` +
    `&agg_level_desc=${encodeURIComponent(geographicLevel)}` +
    `&${locationHeader}=${encodeURIComponent(location)}` +
    `&year=${year}` +
    `&short_desc=${encodeURIComponent("OPERATORS, (ALL) - NUMBER OF OPERATORS")}`;
  }

  // if we are creating a request at the county level, we need to also pass in a state
  if (state) {
    req += `&state_name=${state}`;
  }

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

export const createTableFromSelections = async (selectedOptions: IStateOptions) => {
  const {geographicLevel} = selectedOptions;
  try {
    const allAttrs = getAllAttrs(selectedOptions);
    const items = await Promise.all(getItems(selectedOptions));
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

const getItems = (selectedOptions: IStateOptions) => {
  let {states, years} = selectedOptions;
  const countySelected = selectedOptions.geographicLevel === "County";

  if (states[0] === "All States") {
    states = fiftyStates;
  }

  const items = [];

  for (const state of states) {
    const locations = countySelected ? countyData[state] : [state];
    for (const year of years) {
      for (const location of locations) {
        const item = getDataForSingleYearAndState(selectedOptions, location, year, state);
        items.push(item);
      }
    }
  }

  return items;
};

const getDataForSingleYearAndState = async (selectedOptions: IStateOptions, countyOrState: string, year: string, state?: string) => {
  const {geographicLevel, states, years, cropUnits, ...subOptions} = selectedOptions;

  let item: any = {
    [geographicLevel]: countyOrState,
    "Year": year,
  };

  for (const key in subOptions) {
    const value = subOptions[key as keyof typeof subOptions];
    for (const attribute of value) {
      const queryParams = getQueryParams(attribute);
      const yearAvailable = queryParams?.years[geographicLevel].includes(year);
      const isMultiStateRegion = queryParams?.geographicAreas[0] === "REGION : MULTI-STATE";
      const geoLevel = isMultiStateRegion ? "REGION : MULTI-STATE" : geographicLevel;
      if (yearAvailable) {

        let location = countyOrState;

        if (isMultiStateRegion) {
          const itemToCheck = state ? state : countyOrState;
          const regData = multiRegions.find((region) => region.States.includes(itemToCheck));
          location = regData?.Region ? regData.Region : countyOrState;
        }

        const params: IGetAttrDataParams = {attribute, geographicLevel: geoLevel, location, year};

        if (cropOptions.options.includes(attribute) && cropUnits) {
          params.cropUnits = cropUnits as keyof ICropDataItem;
        }

        if (geoLevel === "County") {
          item.State = state;
          params.state = state;
        }

        const attrData = await getAttrData(params);
        item = {...item, ...attrData};
      }
    }

  }

  return item;
};

const getAttrData = async (params: IGetAttrDataParams) => {
  const {attribute, geographicLevel, location, year, cropUnits, state} = params;
  const reqParams: IGetAttrDataParams = {attribute, geographicLevel, location, year, state};

  if (cropOptions.options.includes(attribute) && cropUnits) {
    reqParams.cropUnits = cropUnits;
  }

  const req = createRequest(reqParams);
  const res = await fetchDataWithRetry(req);
  const values: any = {};
  if (res) {
    const {data} = res;
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
        const dataItems = data.filter((dataItem: any) => subTotalKeys.includes(dataItem.domaincat_desc));
        dataItems.forEach((dataItem: any) => {
          acreTotals[total][dataItem.domaincat_desc] = dataItem.Value.replace(/,/g, "");
        });
        const codapColumnName = attrToCODAPColumnName[total].attributeNameInCodapTable;
        // sum up all the values of acreTotals[total]
        const onlyNumbers = subTotalKeys.map((key) => Number(acreTotals[total][key]));
        const sum = onlyNumbers.reduce((acc, cur) => acc + cur);
        values[codapColumnName] = sum;
      }
    } else {
      data.forEach((dataItem: any) => {
        const dataItemDesc = attribute === "Economic Class" ? dataItem.domaincat_desc : dataItem.short_desc;
        const codapColumnName = attrToCODAPColumnName[dataItemDesc].attributeNameInCodapTable;
        values[codapColumnName] = dataItem.Value;
      });
    }
  } else {
    // eslint-disable-next-line no-console
    console.log(`Error: did not receive response for this request:`, req);
  }
  return values;
};
