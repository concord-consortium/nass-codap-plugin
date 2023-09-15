import fetchJsonp from "fetch-jsonp";
import { queryData } from "./query-headers";
import { IStateOptions } from "../components/types";
import { connect } from "./connect";

const baseURL = `https://quickstats.nass.usda.gov/api/api_GET/?key=9ED0BFB8-8DDD-3609-9940-A2341ED6A9E3`;

export const createRequest = (attribute: string, geoLevel: string, location: string, year: string) => {
  const queryParams = queryData.find((d) => d.plugInAttribute === attribute);
  const {sector, group, commodity, category, domains, dataItem} = queryParams!;

  const baseReq = `${baseURL}&sect_desc=${sector}&group_desc=${group}&commodity_desc=${commodity}&statisticcat_desc=${category}&domain_desc=${domains}&agg_level_desc=${geoLevel}&state_name=${location}&year=${year}`;

  const reqs = [];

  if (Array.isArray(dataItem)) {
    dataItem.forEach(item => {
      reqs.push(`${baseReq}&short_desc=${item}`);
    });
  } else {
    reqs.push(`${baseReq}&short_desc=${dataItem}`);
  }

  return reqs;
};

export const createQueryFromSelections = (selectedOptions: IStateOptions) => {
  const {geographicLevel, states, years, ...subOptions} = selectedOptions;
  const multipleStatesSelected = states.length > 1 || states[0] === "All States";
  const multipleYearsSelected = years.length > 1;

  if (multipleStatesSelected) {
    states.forEach((state) => {
      if (multipleYearsSelected) {
        years.forEach(year => {
          // do something
          console.log("multiple years and mulitple states selected");
        });
      } else {
        console.log("multiple states selected with one year");
      }
    });
  } else {
    for (const key in subOptions) {
      const value = subOptions[key as keyof typeof subOptions];
      console.log("current value", value);
      if (value && Array.isArray(value) && value.length > 1) {
        console.log("you selected more than one value from a sub-category");
      } else if (value && Array.isArray(value) && value.length === 1) {
        console.log("you selected only one value from a sub-category and it is this value", value);
        const reqArray = createRequest(value[0], geographicLevel, states[0], years[0]);
        console.log("REQUEST", reqArray[0]);
        getDataAndCreateCodapTable(reqArray);
      }
    }
  }
};

export const getDataAndCreateCodapTable = (reqs: string[]) => {
  reqs.forEach((req) => {
    fetchJsonp(req)
    .then(function(response) {
      return response.json();
    }).then(function(json) {
      console.log("parsed json", json);
      const formattedData = formatDataForCODAP(json);
    }).catch(function(ex) {
      console.log("parsing failed", ex);
    });
  });
};

const formatDataForCODAP = (res: any) => {
  console.log({res});
  return res;
};

// export const runTestQuery = () => {
//   const request1 = createRequest("Total Farmers", "STATE", "CALIFORNIA", "2017")[0];
//   const request2 = createRequest("Total Farmers", "STATE", "ARKANSAS", "2017")[0];
//   const request3 = createRequest("Total Farmers", "STATE", "ALABAMA", "2017")[0];
//   const request4 = createRequest("Total Farmers", "STATE", "MONTANA", "2017")[0];
//   const requests = [request1, request2, request3, request4];
//   requests.forEach((req) => {
//     fetchJsonp(req)
//     .then(function(response) {
//       return response.json();
//     }).then(function(json) {
//       console.log("parsed json", json);
//     }).catch(function(ex) {
//       console.log("parsing failed", ex);
//     })
//   })
// };
