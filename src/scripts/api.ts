import fetchJsonp from "fetch-jsonp";
import { ICropCategory, ICropDataItem, queryData } from "./query-headers";
import { IStateOptions } from "../components/types";
import { connect } from "./connect";
import { cropOptions } from "../components/constants";

const baseURL = `https://quickstats.nass.usda.gov/api/api_GET/?key=9ED0BFB8-8DDD-3609-9940-A2341ED6A9E3`;

interface IRequestParams {
  attribute: string,
  geographicLevel: string,
  location: string,
  year: string,
  cropCategory?: keyof ICropDataItem
}

interface IGetAttrDataParams {
  attribute: string,
  geographicLevel: string,
  cropUnits: string,
  state: string,
  year: string
}

export const createRequest = ({attribute, geographicLevel, location, year, cropCategory}: IRequestParams) => {
  const queryParams = queryData.find((d) => d.plugInAttribute === attribute);

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

  const baseReq = `${baseURL}` +
  `&sect_desc=${encodeURIComponent(sect_desc)}` +
  `&group_desc=${encodeURIComponent(group_desc)}` +
  `&commodity_desc=${encodeURIComponent(commodity_desc)}` +
  `&statisticcat_desc=${encodeURIComponent(cat as string)}` +
  `&domain_desc=${encodeURIComponent(domain_desc)}` +
  `&agg_level_desc=${geographicLevel}` +
  `&state_name=${location}` +
  `&year=${year}`;

  let req = baseReq;
  item.forEach(subItem => {
    req = req + `&short_desc=${encodeURIComponent(subItem)}`;
  });
  return req;
};

export const createTableFromSelections = async (selectedOptions: IStateOptions) => {
  const {geographicLevel, states, cropUnits, years, ...subOptions} = selectedOptions;
  await connect.getNewDataContext();
  await connect.createTopCollection();

  // need to change this - instead of creating based on UI names, create based on dataItems in queryParams
  const allAttrs: Array<string|ICropDataItem> = ["Year"];
  for (const key in subOptions) {
    const selections = subOptions[key as keyof typeof subOptions];
    for (const attribute of selections) {
      const queryParams = queryData.find((d) => d.plugInAttribute === attribute);
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
  await connect.createSubCollection(allAttrs);
  const items = await getItems(selectedOptions);
  await connect.createItems(items);
  await connect.makeCaseTableAppear();
};

const getItems = async (selectedOptions: IStateOptions) => {
  const {states, years} = selectedOptions;
  const multipleStatesSelected = states.length > 1 || states[0] === "All States";
  const multipleYearsSelected = years.length > 1;

  const items = [];
  if (multipleStatesSelected) {
    for (const state of states) {
      if (multipleYearsSelected) {
        for (const year of years) {
          const item = await getDataForSingleYearAndState(selectedOptions, state, year);
          items.push(item);
        }
      } else {
        const item = await getDataForSingleYearAndState(selectedOptions, state, years[0]);
        items.push(item);
      }
    }
  } else {
    const item = await getDataForSingleYearAndState(selectedOptions, states[0], years[0]);
    items.push(item);
  }

  return items;
};

const getDataForSingleYearAndState = async (selectedOptions: IStateOptions, state: string, year: string) => {
  const {geographicLevel, states, years, cropUnits, ...subOptions} = selectedOptions;

  let item: any = {
    "State": state,
    "Year": year,
  };

  for (const key in subOptions) {
    const value = subOptions[key as keyof typeof subOptions];
    if (value && Array.isArray(value)) {
      for (const attribute of value) {
        const attrData = await getAttrData({attribute, geographicLevel, state, year, cropUnits});
        item = {...item, ...attrData};
      }
    }
  }

  return item;
};

const getAttrData = async (params: IGetAttrDataParams) => {
  const {attribute, geographicLevel, state, year, cropUnits} = params;
  const reqParams: IRequestParams = {attribute, geographicLevel, location: state, year};
  if (cropOptions.options.includes(attribute) && cropUnits) {
    reqParams.cropCategory = cropUnits as keyof ICropDataItem;
  }
  const req = createRequest(reqParams);
  const res = await fetchData(req);
  const values: any = {};
  if (res) {
    const {data} = res;
    data.forEach((dataItem: any) => {
        values[dataItem.short_desc] = dataItem.Value;
    });
  } else {
    console.log("error");
  }
  return values;
};

export const fetchData = async (req: string) => {
  try {
    const response = await fetchJsonp(req);
    const json = await response.json();
    return json;
  } catch (error) {
    console.log("parsing failed", error);
    throw error;
  }
};
