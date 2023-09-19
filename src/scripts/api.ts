import fetchJsonp from "fetch-jsonp";
import { multiRegions, queryData } from "../constants/query-headers";
import { ICropCategory, ICropDataItem, IStateOptions } from "../constants/types";
import { connect } from "./connect";
import { cropOptions } from "../constants/constants";
import { countyData } from "../constants/counties";
import { getQueryParams } from "./utils";

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

export const fetchData = async (req: string) => {
  try {
    const response = await fetchJsonp(req, {timeout: 10000});
    const json = await response.json();
    return json;
  } catch (error) {
    console.log("parsing failed", error);
    throw error;
  }
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
    req += `&state_name=${state}`
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
        allAttrs.push(...short_desc);
      } else {
        allAttrs.push(short_desc);
      }
    }
  }
  await connect.createSubCollection(geographicLevel, allAttrs);
  const items = await getItems(selectedOptions);
  await connect.createItems(items);
  await connect.makeCaseTableAppear();
  // await connect.createItems(items);
};

const getItems = async (selectedOptions: IStateOptions) => {
  const {states, years} = selectedOptions;
  const multipleStatesSelected = states.length > 1 || states[0] === "All States";
  const multipleYearsSelected = years.length > 1;
  const countySelected = selectedOptions.geographicLevel === "County";

  const items = [];

  if (multipleStatesSelected) {
    for (const state of states) {
      if (multipleYearsSelected) {
        for (const year of years) {
          if (countySelected) {
            const allCounties = countyData[state];
            for (const county of allCounties) {
              const item = await getDataForSingleYearAndState(selectedOptions, county, year, state);
              items.push(item);
            }
          } else {
            const item = await getDataForSingleYearAndState(selectedOptions, state, year);
            items.push(item);
          }
        }
      } else {
        const item = await getDataForSingleYearAndState(selectedOptions, state, years[0]);
        items.push(item);
      }
    }
  } else {
    if (countySelected) {
      const allCounties = countyData[states[0]];
      for (const county of allCounties) {
        const item = await getDataForSingleYearAndState(selectedOptions, county, years[0], states[0]);
        items.push(item);
      }
    } else {
      const item = await getDataForSingleYearAndState(selectedOptions, states[0], years[0]);
      items.push(item);
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
            location = multiRegions.find((region) => region.States.includes(itemToCheck))!.Region;
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
  const res = await fetchData(req);
  const values: any = {};
  if (res) {
    const {data} = res;
    data.map((dataItem: any) => {
       return values[dataItem.short_desc] = dataItem.Value;
    });
  } else {
    console.log("error");
  }
  return values;
};
