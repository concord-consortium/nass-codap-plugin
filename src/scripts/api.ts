import fetchJsonp from "fetch-jsonp";
import { ICropDataItem, queryData } from "./query-headers";
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
  const {sector, group, commodity, category, domains, dataItem} = queryParams!;

  let item;
  let cat;
  if (cropCategory) {
    const cropDataItem = queryParams?.dataItem as ICropDataItem;
    const cropCat = queryParams?.category as ICropDataItem;
    item = cropDataItem[cropCategory];
    cat = cropCat[cropCategory];
  } else {
    item = dataItem;
    cat = category;
  }

  const baseReq = `${baseURL}&sect_desc=${sector}&group_desc=${group}&commodity_desc=${commodity}&statisticcat_desc=${cat}&domain_desc=${domains}&agg_level_desc=${geographicLevel}&state_name=${location}&year=${year}`;
  let req = baseReq;
  if (Array.isArray(dataItem)) {
    dataItem.forEach(dItem => {
      req = req + `&short_desc=${dItem}`;
    });
  } else {
    req = req + `&short_desc=${item}`;
  }

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
      const {dataItem} = queryParams!;
      if (Array.isArray(dataItem)) {
        allAttrs.push(...dataItem);
      } else {
        allAttrs.push(dataItem);
      }
    }
  }
  await connect.createSubCollection(allAttrs);
  const items = await getItems(selectedOptions);
  await connect.createItems(items);
  await connect.makeCaseTableAppear();
}

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
  }

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
    })
  } else {
    console.log("error");
  }
  return values;
}

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