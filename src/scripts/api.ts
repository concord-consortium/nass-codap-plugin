import fetchJsonp from "fetch-jsonp";
import { queryData } from "./query-headers";

const baseURL = `https://quickstats.nass.usda.gov/api/api_GET/?key=9ED0BFB8-8DDD-3609-9940-A2341ED6A9E3`;

export const createRequest = (attribute: string, geoLevel: string, location: string, year: string) => {
  const queryParams = queryData.find((d) => d.plugInAttribute === attribute);
  const {sector, group, commodity, category, domains, dataItem} = queryParams!;
  const req = `${baseURL}&sect_desc=${sector}&group_desc=${group}&commodity_desc=${commodity}&statisticcat_desc=${category}&domain_desc=${domains}&short_desc=${dataItem}&agg_level_desc=${geoLevel}&state_name=${location}&year=${year}`;
  return req;
};

export const runTestQuery = () => {
  const request = createRequest("Total Farmers", "STATE", "CALIFORNIA", "2017");
  fetchJsonp(request)
    .then(function(response) {
      return response.json();
    }).then(function(json) {
      console.log("parsed json", json);
    }).catch(function(ex) {
      console.log("parsing failed", ex);
    })
};
