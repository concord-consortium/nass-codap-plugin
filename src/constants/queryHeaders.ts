import { IQueryHeaders } from "./types";

const allYears = [];
for (let year = 2022; year >= 1910; year--) {
  allYears.push(`${year}`);
}

const sharedDemographicHeaders = {
  sect_desc: "Demographics",
  group_desc: "Producers",
  commodity_desc: "Producers",
  statisticcat_desc: "Producers",
  domain_desc: "Total",
  geographicAreas: ["State", "County"]
};

const sharedEconomicHeaders = {
  sect_desc: "Economics",
  group_desc: "Farms & Land & Assets",
  commodity_desc: "Farm Operations",
  statisticcat_desc: "Operations"
};

const sharedLaborHeaders = {
  sect_desc: "Economics",
  group_desc: "Expenses",
  commodity_desc: "Labor",
};

const sharedCropHeaders = {
  sect_desc: "Crops",
  statisticcat_desc: {
    ["Area Harvested"]: "Area Harvested",
    ["Yield"]: "Yield"
  },
  domain_desc: "Total",
  geographicAreas: ["State", "County"],
  years: {
    "County": allYears,
    "State": allYears
  }
};

export const queryData: Array<IQueryHeaders> = [
  {
      plugInAttribute: "Total Farmers",
      ...sharedDemographicHeaders,
      short_desc: ["PRODUCERS, (ALL) - NUMBER OF PRODUCERS"],
      years: {
        "County": ["2017"],
        "State": ["2017"]
      }
  },
  {
      plugInAttribute: "Age",
      ...sharedDemographicHeaders,
      short_desc: [
        "PRODUCERS, AGE LT 25 - NUMBER OF PRODUCERS",
        "PRODUCERS, AGE 25 TO 34 - NUMBER OF PRODUCERS",
        "PRODUCERS, AGE 35 TO 44 - NUMBER OF PRODUCERS",
        "PRODUCERS, AGE 45 TO 54 - NUMBER OF PRODUCERS",
        "PRODUCERS, AGE 55 TO 64 - NUMBER OF PRODUCERS",
        "PRODUCERS, AGE 65 TO 74 - NUMBER OF PRODUCERS",
        "PRODUCERS, AGE GE 75 - NUMBER OF PRODUCERS"
      ],
      years: {
        "County": ["2017"],
        "State": ["2017"]
      }

  },
  {
      plugInAttribute: "Gender",
      ...sharedDemographicHeaders,
      short_desc: [
        "PRODUCERS, (ALL), FEMALE - NUMBER OF PRODUCERS",
        "PRODUCERS, (ALL), MALE - NUMBER OF PRODUCERS"
      ],
      years: {
        "County": ["2017"],
        "State": ["2017"]
      }
  },
  {
      plugInAttribute: "Race",
      ...sharedDemographicHeaders,
      short_desc: [
        "PRODUCERS, AMERICAN INDIAN OR ALASKAN NATIVE - NUMBER OF PRODUCERS",
        "PRODUCERS, ASIAN - NUMBER OF PRODUCERS",
        "PRODUCERS, BLACK OR AFRICAN AMERICAN - NUMBER OF PRODUCERS",
        "PRODUCERS, HISPANIC - NUMBER OF PRODUCERS",
        "PRODUCERS, MULTI-RACE - NUMBER OF PRODUCERS",
        "PRODUCERS, NATIVE HAWAIIAN OR OTHER PACIFIC ISLANDERS - NUMBER OF PRODUCERS",
        "PRODUCERS, WHITE - NUMBER OF PRODUCERS"
      ],
      years: {
        "County": ["2017"],
        "State": ["2017"]
      }
  },
  {
      plugInAttribute: "Total Farms",
      ...sharedEconomicHeaders,
      short_desc: ["FARM OPERATIONS - NUMBER OF OPERATIONS"],
      domain_desc: "Total",
      geographicAreas: ["State", "County"],
      years: {
        "County": allYears,
        "State": allYears
      }
  },
  {
      plugInAttribute: "Organization Type",
      sect_desc: "Demographics",
      group_desc: "Farms & Land & Assets",
      commodity_desc: "Farm Operations",
      statisticcat_desc: "Operations",
      short_desc: [
        "FARM OPERATIONS, ORGANIZATION, TAX PURPOSES, CORPORATION (EXCL FAMILY HELD) - NUMBER OF OPERATIONS",
        "FARM OPERATIONS, ORGANIZATION, TAX PURPOSES, CORPORATION, FAMILY HELD - NUMBER OF OPERATIONS",
        "FARM OPERATIONS, ORGANIZATION, TAX PURPOSES, FAMILY & INDIVIDUAL - NUMBER OF OPERATIONS",
        "FARM OPERATIONS, ORGANIZATION, TAX PURPOSES, INSTITUTIONAL & RESEARCH & RESERVATION & OTHER - NUMBER OF OPERATIONS",
        "FARM OPERATIONS, ORGANIZATION, TAX PURPOSES, PARTNERSHIP - NUMBER OF OPERATIONS"
      ],
      domain_desc: "Total",
      geographicAreas: ["County"],
      years: {
        "County": ["1997", "2002", "2007", "2012", "2017"],
        "State": []
      }
  },
  {
      plugInAttribute: "Economic Class",
      ...sharedEconomicHeaders,
      short_desc: ["FARM OPERATIONS - NUMBER OF OPERATIONS"],
      domain_desc: "Economic Class",
      geographicAreas: ["State"],
      years: {
        "County": allYears.filter(y => Number(y) >= 1998),
        "State": allYears.filter(y => Number(y) >= 1998)
      }
  },
  {
      plugInAttribute: "Acres Operated",
      sect_desc: "Economics",
      group_desc: "Farms & Land & Assets",
      commodity_desc: "Farm Operations",
      statisticcat_desc: "Area Operated",
      short_desc: ["FARM OPERATIONS - ACRES OPERATED"],
      domain_desc: "Area Operated",
      geographicAreas: ["State", "County"],
      years: {
        "County": ["1997", "2002", "2007", "2012", "2017"],
        "State": ["1997", "2002", "2007", "2012", "2017"]
      }
  },
  {
      plugInAttribute: "Organic",
      ...sharedEconomicHeaders,
      short_desc: ["FARM OPERATIONS, ORGANIC - NUMBER OF OPERATIONS"],
      domain_desc: "Organic Status",
      geographicAreas: ["State", "County"],
      years: {
        "County": ["2008", "2011", "2012", "2014", "2015", "2016", "2017", "2019", "2021"],
        "State": ["2008", "2011", "2012", "2014", "2015", "2016", "2017", "2019", "2021"]
      }
  },
  {
      plugInAttribute: "Labor Status",
      ...sharedLaborHeaders,
      statisticcat_desc: "Workers",
      short_desc: [
        "LABOR, MIGRANT - NUMBER OF WORKERS",
        "LABOR, UNPAID - NUMBER OF WORKERS",
        "LABOR, HIRED - NUMBER OF WORKERS"
      ],
      domain_desc: "Total",
      geographicAreas: ["State", "County"],
      years: {
        "County": ["2012", "2017"],
        "State": ["2012", "2017"]
      }
  },
  {
      plugInAttribute: "Wages",
      ...sharedLaborHeaders,
      statisticcat_desc: "Wage Rate",
      short_desc: ["LABOR, HIRED - WAGE RATE, MEASURED IN $ / HOUR"],
      domain_desc: "Total",
      geographicAreas: ["REGION : MULTI-STATE"],
      years: {
        "County": allYears.filter(y => Number(y) >= 1989),
        "State": allYears.filter(y => Number(y) >= 1989)
      }
  },
  {
      plugInAttribute: "Time Worked",
      ...sharedLaborHeaders,
      statisticcat_desc: "Time Worked",
      short_desc: ["LABOR, HIRED - TIME WORKED, MEASURED IN HOURS / WEEK"],
      domain_desc: "Total",
      geographicAreas: ["REGION : MULTI-STATE"],
      years: {
        "County": allYears.filter(y => Number(y) >= 1989),
        "State": allYears.filter(y => Number(y) >= 1989)
      }
  },
  {
      plugInAttribute: "Corn",
      group_desc: "Field Crops",
      commodity_desc: "Corn",
      short_desc: {
        ["Area Harvested"]: ["CORN, GRAIN - ACRES HARVESTED"],
        ["Yield"]: ["CORN, GRAIN - YIELD, MEASURED IN BU / ACRE"]
      },
      ...sharedCropHeaders
  },
  {
    plugInAttribute: "Cotton",
    group_desc: "Field Crops",
    commodity_desc: "Cotton",
    short_desc: {
      ["Area Harvested"]: ["COTTON - ACRES HARVESTED"],
      ["Yield"]: ["COTTON - YIELD, MEASURED IN LB / ACRE"]
    },
    ...sharedCropHeaders
  },
  {
    plugInAttribute: "Grapes",
    group_desc: "Fruit & Tree Nuts",
    commodity_desc: "Grapes",
    short_desc: {
      ["Area Harvested"]: ["GRAPES, ORGANIC - ACRES HARVESTED"],
      ["Yield"]: ["GRAPES - YIELD, MEASURED IN TONS / ACRE"]
    },
    ...sharedCropHeaders
  },
  {
    plugInAttribute: "Oats",
    group_desc: "Field Crops",
    commodity_desc: "Oats",
    short_desc: {
      ["Area Harvested"]: ["OATS - ACRES HARVESTED"],
      ["Yield"]: ["OATS - YIELD, MEASURED IN BU / ACRE"]
    },
    ...sharedCropHeaders
  },
  {
    plugInAttribute: "Soybeans",
    group_desc: "Field Crops",
    commodity_desc: "Soybeans",
    short_desc: {
      ["Area Harvested"]: ["SOYBEANS - ACRES HARVESTED"],
      ["Yield"]: ["SOYBEANS - YIELD MEASURED IN BU / ACRE"]
    },
    ...sharedCropHeaders
  },
  {
    plugInAttribute: "Wheat",
    group_desc: "Field Crops",
    commodity_desc: "Wheat",

    short_desc: {
      ["Area Harvested"]: ["WHEAT - ACRES HARVESTED"],
      ["Yield"]: ["WHEAT - YIELD MEASURED IN BU / ACRE"]
    },
    ...sharedCropHeaders
  }
];
