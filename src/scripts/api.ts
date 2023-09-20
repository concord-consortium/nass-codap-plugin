import fetchJsonp from "fetch-jsonp";
import { ICropCategory, ICropDataItem, IStateOptions } from "../constants/types";
import { multiRegions } from "../constants/regionData";
import { connect } from "./connect";
import { cropOptions, fiftyStates } from "../constants/constants";
import { countyData } from "../constants/counties";
import { getQueryParams } from "./utils";
import { attrToCODAPColumnName } from "../constants/codapMetadata";

const baseURL = `https://quickstats.nass.usda.gov/api/api_GET/?key=9ED0BFB8-8DDD-3609-9940-A2341ED6A9E3`;

interface IRequestParams {
  attribute: string,
  geographicLevel: string,
  location: string,
  year: string,
  cropCategory?: keyof ICropDataItem,
  state?: string
}

interface IGetAttrDataParams {
  attribute: string,
  geographicLevel: string,
  cropUnits: string,
  location: string,
  year: string
  state?: string
}

// export const fetchData = async (req: string) => {
//   try {
//     const response = await fetchJsonp(req, {timeout: 10000});
//     const json = await response.json();
//     return json;
//   } catch (error) {
//     console.log("parsing failed", error);
//     throw error;
//   }
// };

export const fetchDataWithRetry = async (req: string, maxRetries = 3) => {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      const response = await fetchJsonp(req, { timeout: 30000 }); // Increase the timeout
      const json = await response.json();
      return json;
    } catch (error) {
      console.log(`Request attempt ${retries + 1} failed:`, error);
      retries++;
    }
  }
  throw new Error(`Request failed after ${maxRetries} attempts`);
};

export const createRequest = ({attribute, geographicLevel, location, year, cropCategory, state}: IRequestParams) => {
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

  const item = cropCategory ?
    (queryParams?.short_desc as ICropDataItem)[cropCategory] :
    short_desc as string[];
  const cat = cropCategory ?
    (queryParams?.statisticcat_desc as ICropCategory)[cropCategory] :
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

  // if we are creating a request at the county level, we need to also pass in a state
  if (state) {
    req += `&state_name=${state}`;
  }

  item.forEach(subItem => {
    req = req + `&short_desc=${encodeURIComponent(subItem)}`;
  });
  return req;
};

export const createTableFromSelections = async (selectedOptions: IStateOptions) => {
  const {geographicLevel, states, cropUnits, years, ...subOptions} = selectedOptions;
  await connect.getNewDataContext();
  await connect.createTopCollection(geographicLevel);

  const allAttrs: Array<string|ICropDataItem> = ["Year"];

  for (const key in subOptions) {
    const selections = subOptions[key as keyof typeof subOptions];
    for (const attribute of selections) {
      const queryParams = getQueryParams(attribute);
      if (!queryParams) {
        throw new Error("Invalid attribute");
      }
      const {short_desc} = queryParams;
      if (Array.isArray(short_desc)) {
        for (const desc of short_desc) {
          console.log({desc});
          const codapColumnName = attrToCODAPColumnName[desc].attributeNameInCodapTable;
          allAttrs.push(codapColumnName);
        }
      } else if (typeof short_desc === "object" && cropUnits) {
        const attr = short_desc[cropUnits as keyof ICropDataItem][0];
        allAttrs.push(attrToCODAPColumnName[attr].attributeNameInCodapTable);
      }
    }
  }

  await connect.createSubCollection(geographicLevel, allAttrs);
  const items = await getItems(selectedOptions);
  await connect.createItems(items);
  await connect.makeCaseTableAppear();
};

const getItems = async (selectedOptions: IStateOptions) => {
  let {states, years} = selectedOptions;
  const multipleStatesSelected = states.length > 1 || states[0] === "All States";
  const multipleYearsSelected = years.length > 1;
  const countySelected = selectedOptions.geographicLevel === "County";

  if (states[0] === "All States") {
    states = fiftyStates;
  }

  const promises = [];

  if (multipleStatesSelected) {
    for (const state of states) {
      if (multipleYearsSelected) {
        for (const year of years) {
          if (countySelected) {
            const allCounties = countyData[state];
            for (const county of allCounties) {
              const item = getDataForSingleYearAndState(selectedOptions, county, year, state);
              promises.push(item);
            }
          } else {
            const item = getDataForSingleYearAndState(selectedOptions, state, year);
            promises.push(item);
          }
        }
      } else {
        const item = getDataForSingleYearAndState(selectedOptions, state, years[0]);
        promises.push(item);
      }
    }
  } else {
    if (countySelected) {
      const allCounties = countyData[states[0]];
      for (const county of allCounties) {
        const item = getDataForSingleYearAndState(selectedOptions, county, years[0], states[0]);
        promises.push(item);
      }
    } else {
      const item = getDataForSingleYearAndState(selectedOptions, states[0], years[0]);
      promises.push(item);
    }
  }
  return await Promise.all(promises);
};

const getDataForSingleYearAndState = async (selectedOptions: IStateOptions, countyOrState: string, year: string, state?: string) => {
  const {geographicLevel, states, years, cropUnits, ...subOptions} = selectedOptions;

  let item: any = {
    [geographicLevel]: countyOrState,
    "Year": year,
  };

  for (const key in subOptions) {
    const value = subOptions[key as keyof typeof subOptions];
    if (value && Array.isArray(value)) {
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
          const params: IGetAttrDataParams = {attribute, geographicLevel: geoLevel, location, year, cropUnits};
          if (geoLevel === "County") {
            params.state = state;
          }
          const attrData = await getAttrData(params);
          item = {...item, ...attrData};
        }
      }
    }
  }

  return item;
};

const getAttrData = async (params: IGetAttrDataParams) => {
  const {attribute, geographicLevel, location, year, cropUnits, state} = params;
  const reqParams: IRequestParams = {attribute, geographicLevel, location, year, state};
  if (cropOptions.options.includes(attribute) && cropUnits) {
    reqParams.cropCategory = cropUnits as keyof ICropDataItem;
  }
  const req = createRequest(reqParams);
  const res = await fetchDataWithRetry(req);
  const values: any = {};
  if (res) {
    const {data} = res;
    data.map((dataItem: any) => {
       const codapColumnName = attrToCODAPColumnName[dataItem.short_desc].attributeNameInCodapTable;
       return values[codapColumnName] = dataItem.Value;
    });
  } else {
    console.log("error");
  }
  return values;
};
