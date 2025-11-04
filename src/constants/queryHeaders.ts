import { IQueryHeaders } from "./types";

const allYears: string[] = [];
for (let year = 2024; year >= 1910; year--) {
  allYears.push(`${year}`);
}

// The USDA Census of Agriculture occurs once every five years. These census years
// are used exclusively by some of the attributes below.
const censusYears = ["1997", "2002", "2007", "2012", "2017", "2022"];

const yearsFrom = (startYear: number) => allYears.filter(y => Number(y) >= startYear);
const yearsUpTo = (endYear: number) => allYears.filter(y => Number(y) <= endYear);
const yearsBetween = (startYear: number, endYear: number) => 
  allYears.filter(y => Number(y) >= startYear && Number(y) <= endYear);

const censusYearsFrom = (startYear: (typeof censusYears)[number]) => {
  const index = censusYears.indexOf(startYear);
  return censusYears.slice(index);
};

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
  domain_desc: "Total",
  geographicAreas: ["State", "County"]
};

const sharedLivestockHeaders = {
  sect_desc: "Animals & Products",
  domain_desc: "Total",
  geographicAreas: ["State", "County"]
};

export const queryData: Array<IQueryHeaders> = [
  {
      plugInAttribute: "Total Farmers",
      ...sharedDemographicHeaders,
      short_desc: ["PRODUCERS, (ALL) - NUMBER OF PRODUCERS"],
      years: {
        "County": censusYearsFrom("2002"),
        "State": censusYearsFrom("2002")
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
        "County": censusYearsFrom("2017"),
        "State": censusYearsFrom("2017")
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
        "County": censusYearsFrom("2017"),
        "State": censusYearsFrom("2017")
      }
  },
  {
      plugInAttribute: "Race",
      ...sharedDemographicHeaders,
      short_desc: [
        "PRODUCERS, AMERICAN INDIAN OR ALASKA NATIVE - NUMBER OF PRODUCERS",
        "PRODUCERS, ASIAN - NUMBER OF PRODUCERS",
        "PRODUCERS, BLACK OR AFRICAN AMERICAN - NUMBER OF PRODUCERS",
        "PRODUCERS, HISPANIC - NUMBER OF PRODUCERS",
        "PRODUCERS, MULTI-RACE - NUMBER OF PRODUCERS",
        "PRODUCERS, NATIVE HAWAIIAN OR OTHER PACIFIC ISLANDER - NUMBER OF PRODUCERS",
        "PRODUCERS, WHITE - NUMBER OF PRODUCERS"
      ],
      years: {
        "County": censusYearsFrom("2017"),
        "State": censusYearsFrom("2017")
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
        "FARM OPERATIONS, ORGANIZATION, TAX PURPOSES, CORPORATION, (EXCL FAMILY HELD) - NUMBER OF OPERATIONS",
        "FARM OPERATIONS, ORGANIZATION, TAX PURPOSES, CORPORATION, FAMILY HELD - NUMBER OF OPERATIONS",
        "FARM OPERATIONS, ORGANIZATION, TAX PURPOSES, FAMILY & INDIVIDUAL - NUMBER OF OPERATIONS",
        "FARM OPERATIONS, ORGANIZATION, TAX PURPOSES, INSTITUTIONAL & RESEARCH & RESERVATION & OTHER - NUMBER OF OPERATIONS",
        "FARM OPERATIONS, ORGANIZATION, TAX PURPOSES, PARTNERSHIP - NUMBER OF OPERATIONS"
      ],
      domain_desc: "Total",
      geographicAreas: ["State", "County"],
      years: {
        "County": censusYears,
        "State": censusYears
      }
  },
  {
      plugInAttribute: "Economic Class",
      ...sharedEconomicHeaders,
      short_desc: ["FARM OPERATIONS - NUMBER OF OPERATIONS"],
      domain_desc: "Economic Class",
      geographicAreas: ["State"],
      years: {
        "County": [],
        "State": yearsFrom(1987)
      }
  },
  {
      plugInAttribute: "Acres Operated",
      sect_desc: "Economics",
      group_desc: "Farms & Land & Assets",
      commodity_desc: "Farm Operations",
      statisticcat_desc: "Operations",
      short_desc: ["FARM OPERATIONS - NUMBER OF OPERATIONS"],
      domain_desc: "Area Operated",
      geographicAreas: ["State", "County"],
      years: {
        "County": censusYears,
        "State": censusYears
      }
  },
  {
      plugInAttribute: "Organic",
      ...sharedEconomicHeaders,
      short_desc: ["FARM OPERATIONS, ORGANIC - NUMBER OF OPERATIONS"],
      domain_desc: "Organic Status",
      geographicAreas: ["State", "County"],
      years: {
        "County": ["2022", "2021", "2019", "2017", "2016", "2015", "2014", "2012", "2011", "2008"],
        "State": ["2022", "2021", "2019", "2017", "2016", "2015", "2014", "2012", "2011", "2008"]
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
        "County": censusYearsFrom("2012"),
        "State": censusYearsFrom("2012")
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
        "County": yearsFrom(1989),
        "State": yearsFrom(1989)
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
        "County": yearsFrom(1989),
        "State": yearsFrom(1989)
      }
  },
  {
      plugInAttribute: "Corn",
      group_desc: "Field Crops",
      commodity_desc: "Corn",
      statisticcat_desc: {
        ["Area Harvested"]: "Area Harvested",
        ["Yield"]: "Yield"
      },
      short_desc: {
        ["Area Harvested"]: ["CORN, GRAIN - ACRES HARVESTED"],
        ["Yield"]: ["CORN, GRAIN - YIELD, MEASURED IN BU / ACRE"]
      },
      years: {
        "County": allYears,
        "State": allYears
      },
      ...sharedCropHeaders
  },
  {
    plugInAttribute: "Cotton",
    group_desc: "Field Crops",
    commodity_desc: "Cotton",
    statisticcat_desc: {
      ["Area Harvested"]: "Area Harvested",
      ["Yield"]: "Yield"
    },
    short_desc: {
      ["Area Harvested"]: ["COTTON, UPLAND - ACRES HARVESTED"],
      ["Yield"]: ["COTTON, UPLAND - YIELD, MEASURED IN LB / ACRE"]
    },
    years: {
      "County": yearsUpTo(2022),
      "State": yearsUpTo(2022)
    },
    ...sharedCropHeaders
  },
  {
    plugInAttribute: "Grapes",
    group_desc: "Fruit & Tree Nuts",
    commodity_desc: "Grapes",
    statisticcat_desc: {
      ["Area Harvested"]: "Area Bearing",
      ["Yield"]: "Yield"
    },
    short_desc: {
      ["Area Harvested"]: ["GRAPES - ACRES BEARING"],
      ["Yield"]: ["GRAPES - YIELD, MEASURED IN TONS / ACRE"]
    },
    years: {
      "County": allYears.filter(y => y === "2002" || Number(y) >= 2007),
      "State": allYears.filter(y => y === "2002" || Number(y) >= 2007)
    },
    ...sharedCropHeaders
  },
  {
    plugInAttribute: "Hay",
    group_desc: "Field Crops",
    commodity_desc: "Hay",
    statisticcat_desc: {
      ["Area Harvested"]: "Area Harvested",
      ["Yield"]: "Yield"
    },
    short_desc: {
      ["Area Harvested"]: ["HAY - ACRES HARVESTED"],
      ["Yield"]: ["HAY - YIELD, MEASURED IN TONS / ACRE"]
    },
    years: {
      "County": ["2022", "2017", "2012", ...yearsBetween(1918, 2008)],
      "State": allYears
    },
    ...sharedCropHeaders
  },
  {
    plugInAttribute: "Oats",
    group_desc: "Field Crops",
    commodity_desc: "Oats",
    statisticcat_desc: {
      ["Area Harvested"]: "Area Harvested",
      ["Yield"]: "Yield"
    },
    short_desc: {
      ["Area Harvested"]: ["OATS - ACRES HARVESTED"],
      ["Yield"]: ["OATS - YIELD, MEASURED IN BU / ACRE"]
    },
    years: {
      "County": allYears,
      "State": allYears
    },
    ...sharedCropHeaders
  },
  {
    plugInAttribute: "Soybeans",
    group_desc: "Field Crops",
    commodity_desc: "Soybeans",
    statisticcat_desc: {
      ["Area Harvested"]: "Area Harvested",
      ["Yield"]: "Yield"
    },
    short_desc: {
      ["Area Harvested"]: ["SOYBEANS - ACRES HARVESTED"],
      ["Yield"]: ["SOYBEANS - YIELD, MEASURED IN BU / ACRE"]
    },
    years: {
      "County": allYears,
      "State": allYears
    },
    ...sharedCropHeaders
  },
  {
    plugInAttribute: "Tobacco",
    group_desc: "Field Crops",
    commodity_desc: "Tobacco",
    statisticcat_desc: {
      ["Area Harvested"]: "Area Harvested",
      ["Yield"]: "Yield"
    },
    short_desc: {
      ["Area Harvested"]: ["TOBACCO - ACRES HARVESTED"],
      ["Yield"]: ["TOBACCO - YIELD, MEASURED IN LB / ACRE"]
    },
    years: {
      "County": ["2022", "2017", "2012", "2007", "2002", "1997"],
      "State": allYears
    },
    ...sharedCropHeaders
  },
  {
    plugInAttribute: "Wheat",
    group_desc: "Field Crops",
    commodity_desc: "Wheat",
    statisticcat_desc: {
      ["Area Harvested"]: "Area Harvested",
      ["Yield"]: "Yield"
    },
    short_desc: {
      ["Area Harvested"]: ["WHEAT - ACRES HARVESTED"],
      ["Yield"]: ["WHEAT - YIELD, MEASURED IN BU / ACRE"]
    },
    years: {
      "County": yearsUpTo(2022),
      "State": allYears
    },
    ...sharedCropHeaders
  },
  {
      plugInAttribute: "Cattle",
      group_desc: "Livestock",
      commodity_desc: "Cattle",
      statisticcat_desc: {
        ["Inventory"]: "Inventory"
      },
      short_desc: {
        ["Inventory"]: ["CATTLE, INCL CALVES - INVENTORY"]
      },
      years: {
        "County": yearsFrom(1920),
        "State": allYears
      },
      ...sharedLivestockHeaders
  },
  {
      plugInAttribute: "Chickens",
      group_desc: "Poultry",
      commodity_desc: "Chickens",
      statisticcat_desc: {
        ["Inventory"]: "Inventory"
      },
      short_desc: {
        ["Inventory, Broilers"]: ["CHICKENS, BROILERS - INVENTORY"],
        ["Inventory, Layers"]: ["CHICKENS, LAYERS - INVENTORY"]
      },
      years: {
        "County": censusYears,
        "State": censusYears
      },
      ...sharedLivestockHeaders
  },
  {
      plugInAttribute: "Hogs",
      group_desc: "Livestock",
      commodity_desc: "Hogs",
      statisticcat_desc: {
        ["Inventory"]: "Inventory"
      },
      short_desc: {
        ["Inventory"]: ["HOGS - INVENTORY"]
      },
      years: {
        "County": yearsFrom(1919),
        "State": allYears
      },
      ...sharedLivestockHeaders
  },
  {
      plugInAttribute: "Horses & Ponies",
      group_desc: "Specialty",
      commodity_desc: "Equine",
      statisticcat_desc: {
        ["Inventory"]: "Inventory"
      },
      short_desc: {
        ["Inventory"]: ["EQUINE, HORSES & PONIES - INVENTORY"]
      },
      years: {
        "County": censusYearsFrom("2002"),
        "State": censusYears
      },
      ...sharedLivestockHeaders
  }
];
