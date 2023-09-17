const areaHarvested = "Area Harvested";
const yieldInBU = "Yield";

export interface ICropCategory {
  [areaHarvested]: string,
  [yieldInBU]: string
}
export interface ICropDataItem {
  [areaHarvested]: string[],
  [yieldInBU]: string[]
}

export interface IQueryHeaders {
  plugInAttribute: string,
  numberOfAttributeColumnsInCodap: number|string,
  sect_desc: string,
  group_desc: string,
  commodity_desc: string,
  statisticcat_desc: string|ICropCategory,
  short_desc: string[]|ICropDataItem,
  domain_desc: string,
  geographicLevels?: string,
  years: {
    county: string[]
    state: string[]
  }
}

const sharedDemographicHeaders = {
sect_desc: "Demographics",
group_desc: "Producers",
commodity_desc: "Producers",
statisticcat_desc: "Producers",
domain_desc: "Total",
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

const allYears = [];
for (let year = 2022; year >= 1910; year--) {
  allYears.push(`${year}`);
}

export const queryData: Array<IQueryHeaders> = [
{
    plugInAttribute: "Total Farmers",
    numberOfAttributeColumnsInCodap: 1,
    ...sharedDemographicHeaders,
    short_desc: ["PRODUCERS, (ALL) - NUMBER OF PRODUCERS"],
    years: {
      county: ["2017"],
      state: ["2017"]
    }
},
{
    plugInAttribute: "Age",
    numberOfAttributeColumnsInCodap: 7,
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
      county: ["2017"],
      state: ["2017"]
    }

},
{
    plugInAttribute: "Gender",
    numberOfAttributeColumnsInCodap: 2,
    ...sharedDemographicHeaders,
    short_desc: [
      "PRODUCERS, (ALL), FEMALE - NUMBER OF PRODUCERS",
      "PRODUCERS, (ALL), MALE - NUMBER OF PRODUCERS"
    ],
    years: {
      county: ["2017"],
      state: ["2017"]
    }
},
{
    plugInAttribute: "Race",
    numberOfAttributeColumnsInCodap: 7,
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
      county: ["2017"],
      state: ["2017"]
    }
},
{
    plugInAttribute: "Total Farms",
    numberOfAttributeColumnsInCodap: 1,
    ...sharedEconomicHeaders,
    short_desc: ["FARM OPERATIONS - NUMBER OF OPERATIONS"],
    domain_desc: "Total",
    geographicLevels: "State, County",
    years: {
      county: allYears,
      state: allYears
    }
},
{
    plugInAttribute: "Organization Type",
    numberOfAttributeColumnsInCodap: 5,
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
    geographicLevels: "County",
    years: {
      county: ["1997", "2002", "2007", "2012", "2017"],
      state: []
    }
},
{
    plugInAttribute: "Economic Class",
    numberOfAttributeColumnsInCodap: "3 - 6",
    ...sharedEconomicHeaders,
    short_desc: ["FARM OPERATIONS - NUMBER OF OPERATIONS"],
    domain_desc: "Economic Class",
    geographicLevels: "State ",
    years: {
      county: allYears.filter(y => Number(y) >= 1987),
      state: allYears.filter(y => Number(y) >= 1987)
    }
},
{
    plugInAttribute: "Acres Operated",
    numberOfAttributeColumnsInCodap: 14,
    sect_desc: "Economics",
    group_desc: "Farms & Land & Assets",
    commodity_desc: "Farm Operations",
    statisticcat_desc: "Area Operated",
    short_desc: ["FARM OPERATIONS - ACRES OPERATED"],
    domain_desc: "Area Operated",
    geographicLevels: "State, County",
    years: {
      county: ["1997", "2002", "2007", "2012", "2017"],
      state: ["1997", "2002", "2007", "2012", "2017"]
    }
},
{
    plugInAttribute: "Organic",
    numberOfAttributeColumnsInCodap: 1,
    ...sharedEconomicHeaders,
    short_desc: ["FARM OPERATIONS, ORGANIC - NUMBER OF OPERATIONS"],
    domain_desc: "Organic Status",
    years: {
      county: ["2008", "2011", "2012", "2014", "2015", "2016", "2017", "2019", "2021"],
      state: ["2008", "2011", "2012", "2014", "2015", "2016", "2017", "2019", "2021"]
    }
},
{
    plugInAttribute: "Labor Status",
    numberOfAttributeColumnsInCodap: 3,
    ...sharedLaborHeaders,
    statisticcat_desc: "Workers",
    short_desc: [
      "LABOR, MIGRANT - NUMBER OF WORKERS",
      "LABOR, UNPAID - NUMBER OF WORKERS",
      "LABOR, HIRED - NUMBER OF WORKERS"
    ],
    domain_desc: "Total",
    geographicLevels: "State, County",
    years: {
      county: ["2012", "2017"],
      state: ["2012", "2017"]
    }
},
{
    plugInAttribute: "Wages",
    numberOfAttributeColumnsInCodap: 1,
    ...sharedLaborHeaders,
    statisticcat_desc: "Wage Rate",
    short_desc: ["LABOR, HIRED - WAGE RATE, MEASURED IN $/HOUR"],
    domain_desc: "Total",
    geographicLevels: "Region: Multi-state",
    years: {
      county: allYears.filter(y => Number(y) >= 1989),
      state: allYears.filter(y => Number(y) >= 1989)
    }
},
{
    plugInAttribute: "Time Worked",
    numberOfAttributeColumnsInCodap: 1,
    ...sharedLaborHeaders,
    statisticcat_desc: "Wage Rate",
    short_desc: ["LABOR, HIRED - TIME WORKED, MEASURED IN HOURS/WEEK"],
    domain_desc: "Total",
    geographicLevels: "Region: Multi-state",
    years: {
      county: allYears.filter(y => Number(y) >= 1989),
      state: allYears.filter(y => Number(y) >= 1989)
    }
},
{
    plugInAttribute: "Corn",
    numberOfAttributeColumnsInCodap: 1,
    sect_desc: "Crops",
    group_desc: "Field Crops",
    commodity_desc: "Corn",
    statisticcat_desc: {
      [areaHarvested]: "Area Harvested",
      [yieldInBU]: "Yield"
    },
    short_desc: {
      [areaHarvested]: ["CORN, GRAIN - ACRES HARVESTED"],
      [yieldInBU]: ["CORN, GRAIN - YIELD, MEASURED IN BU / ACRE"]
    },
    domain_desc: "Total",
    geographicLevels: "State, County",
    years: {
      county: allYears,
      state: allYears
    }
},
{
  plugInAttribute: "Cotton",
  numberOfAttributeColumnsInCodap: 1,
  sect_desc: "Crops",
  group_desc: "Field Crops",
  commodity_desc: "Cotton",
  statisticcat_desc: {
    [areaHarvested]: "Area Harvested",
    [yieldInBU]: "Yield"
  },
  short_desc: {
    [areaHarvested]: ["COTTON - ACRES HARVESTED"],
    [yieldInBU]: ["COTTON - YIELD, MEASURED IN LB / ACRE"]
  },
  domain_desc: "Total",
  geographicLevels: "State, County",
  years: {
    county: allYears,
    state: allYears
  }
},
{
  plugInAttribute: "Grapes",
  numberOfAttributeColumnsInCodap: 1,
  sect_desc: "Crops",
  group_desc: "Fruit & Tree Nuts",
  commodity_desc: "Grapes",
  statisticcat_desc: {
    [areaHarvested]: "Area Harvested",
    [yieldInBU]: "Yield"
  },
  short_desc: {
    [areaHarvested]: ["GRAPES, ORGANIC - ACRES HARVESTED"],
    [yieldInBU]: ["GRAPES - YIELD, MEASURED IN TONS / ACRE"]
  },
  domain_desc: "Total",
  geographicLevels: "State, County",
  years: {
    county: allYears,
    state: allYears
  }
},
{
  plugInAttribute: "Oats",
  numberOfAttributeColumnsInCodap: 1,
  sect_desc: "Crops",
  group_desc: "Field Crops",
  commodity_desc: "Oats",
  statisticcat_desc: {
    [areaHarvested]: "Area Harvested",
    [yieldInBU]: "Yield"
  },
  short_desc: {
    [areaHarvested]: ["Oats - Acres Harvested"],
    [yieldInBU]: ["Oats - Yield, measured in BU / acre"]
  },
  domain_desc: "Total",
  geographicLevels: "State, County",
  years: {
    county: allYears,
    state: allYears
  }
},
{
  plugInAttribute: "Soybeans",
  numberOfAttributeColumnsInCodap: 1,
  sect_desc: "Crops",
  group_desc: "Field Crops",
  commodity_desc: "Soybeans",
  statisticcat_desc: {
    [areaHarvested]: "Area Harvested",
    [yieldInBU]: "Yield"
  },
  short_desc: {
    [areaHarvested]: ["Soybeans - Acres Harvested"],
    [yieldInBU]: ["Soybeans - Yield, measured in BU / acre"]
  },
  domain_desc: "Total",
  geographicLevels: "State, County",
  years: {
    county: allYears,
    state: allYears
  }
},
{
  plugInAttribute: "Wheat",
  numberOfAttributeColumnsInCodap: 1,
  sect_desc: "Crops",
  group_desc: "Field Crops",
  commodity_desc: "Wheat",
  statisticcat_desc: {
    [areaHarvested]: "Area Harvested",
    [yieldInBU]: "Yield"
  },
  short_desc: {
    [areaHarvested]: ["Wheat - Acres Harvested"],
    [yieldInBU]: ["Wheat - Yield, measured in BU / acre"]
  },
  domain_desc: "Total",
  geographicLevels: "State, County",
  years: {
    county: allYears,
    state: allYears
  }
}
];
