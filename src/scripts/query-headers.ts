const areaHarvested = "Area Harvested";
const yieldInBU = "Yield";
export interface ICropDataItem {
  [areaHarvested]: string,
  [yieldInBU]: string
}

interface IQueryHeaders {
  plugInAttribute: string,
  numberOfAttributeColumnsInCodap: number|string,
  sector: string,
  group: string,
  commodity: string,
  category: string|ICropDataItem,
  dataItem: string|string[]|ICropDataItem,
  domains: string,
  geographicLevels?: string,
  years: {
    county: string[]
    state: string[]
  }
}

const sharedDemographicHeaders = {
sector: "Demographics",
group: "Producers",
commodity: "Producers",
category: "Producers",
domains: "Total",
};

const sharedEconomicHeaders = {
sector: "Economics",
group: "Farms & Land & Assets",
commodity: "Farm Operations",
category: "Operations"
};

const sharedLaborHeaders = {
sector: "Economics",
group: "Expenses",
commodity: "Labor",
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
    dataItem: "PRODUCERS, (ALL) - NUMBER OF PRODUCERS",
    years: {
      county: ["2017"],
      state: ["2017"]
    }
},
{
    plugInAttribute: "Age",
    numberOfAttributeColumnsInCodap: 7,
    ...sharedDemographicHeaders,
    dataItem: [
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
    dataItem: [
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
    dataItem: [
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
    dataItem: "Farm Operations - Number of Operations",
    domains: "Total",
    geographicLevels: "State, County",
    years: {
      county: allYears,
      state: allYears
    }
},
{
    plugInAttribute: "Organization Type",
    numberOfAttributeColumnsInCodap: 5,
    sector: "Demographics",
    group: "Farms & Land & Assets",
    commodity: "Farm Operations",
    category: "Operations",
    dataItem: [
      "FARM OPERATIONS, ORGANIZATION, TAX PURPOSES, CORPORATION (EXCL FAMILY HELD) - NUMBER OF OPERATIONS",
      "FARM OPERATIONS, ORGANIZATION, TAX PURPOSES, CORPORATION, FAMILY HELD - NUMBER OF OPERATIONS",
      "FARM OPERATIONS, ORGANIZATION, TAX PURPOSES, FAMILY & INDIVIDUAL - NUMBER OF OPERATIONS",
      "FARM OPERATIONS, ORGANIZATION, TAX PURPOSES, INSTITUTIONAL & RESEARCH & RESERVATION & OTHER - NUMBER OF OPERATIONS",
      "FARM OPERATIONS, ORGANIZATION, TAX PURPOSES, PARTNERSHIP - NUMBER OF OPERATIONS"
    ],
    domains: "Total",
    geographicLevels: "State, County",
    years: {
      county: ["1997", "2002", "2007", "2012", "2017"],
      state: allYears
    }
},
{
    plugInAttribute: "Economic Class",
    numberOfAttributeColumnsInCodap: "3 - 6",
    ...sharedEconomicHeaders,
    dataItem: "Farm Operations - Number of Operations",
    domains: "Economic Class",
    geographicLevels: "State ",
    years: {
      county: allYears.filter(y => Number(y) >= 1987),
      state: allYears.filter(y => Number(y) >= 1987)
    }
},
{
    plugInAttribute: "Acres Operated",
    numberOfAttributeColumnsInCodap: 14,
    sector: "Economics",
    group: "Farms & Land & Assets",
    commodity: "Farm Operations",
    category: "Area Operated",
    dataItem: "Farm Operations - Acres Operated",
    domains: "Area Operated",
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
    dataItem: "Farm Operations, Organic - Number of Operations",
    domains: "Organic Status",
    years: {
      county: ["2008", "2011", "2012", "2014", "2015", "2016", "2017", "2019", "2021"],
      state: ["2008", "2011", "2012", "2014", "2015", "2016", "2017", "2019", "2021"]
    }
},
{
    plugInAttribute: "Labor Status",
    numberOfAttributeColumnsInCodap: 3,
    ...sharedLaborHeaders,
    category: "Workers",
    dataItem: [
      "LABOR, MIGRANT - NUMBER OF WORKERS",
      "LABOR, UNPAID - NUMBER OF WORKERS",
      "LABOR, HIRED - NUMBER OF WORKERS"
    ],
    domains: "Total",
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
    category: "Wage Rate",
    dataItem: "LABOR, HIRED - WAGE RATE, MEASURED IN $/HOUR",
    domains: "Total",
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
    category: "Wage Rate",
    dataItem: "Labor, Hired - Time Worked, Measured in Hours/Week",
    domains: "Total",
    geographicLevels: "Region: Multi-state",
    years: {
      county: allYears.filter(y => Number(y) >= 1989),
      state: allYears.filter(y => Number(y) >= 1989)
    }
},
{
    plugInAttribute: "Corn",
    numberOfAttributeColumnsInCodap: 1,
    sector: "Crops",
    group: "Field Crops",
    commodity: "Corn",
    category: {
      [areaHarvested]: "Area Harvested",
      [yieldInBU]: "Yield"
    },
    dataItem: {
      [areaHarvested]: "Corn, Grain - Acres Harvested",
      [yieldInBU]: "Corn, Grain - Yield, measured in BU / acre"
    },
    domains: "Total",
    geographicLevels: "State, County",
    years: {
      county: allYears,
      state: allYears
    }
},
{
  plugInAttribute: "Cotton",
  numberOfAttributeColumnsInCodap: 1,
  sector: "Crops",
  group: "Field Crops",
  commodity: "Cotton",
  category: {
    [areaHarvested]: "Area Harvested",
    [yieldInBU]: "Yield"
  },
  dataItem: {
    [areaHarvested]: "Cotton - Acres Harvested",
    [yieldInBU]: "Cotton - Yield, measured in LB / acre"
  },
  domains: "Total",
  geographicLevels: "State, County",
  years: {
    county: allYears,
    state: allYears
  }
},
{
  plugInAttribute: "Grapes",
  numberOfAttributeColumnsInCodap: 1,
  sector: "Crops",
  group: "Fruit & Tree Nuts",
  commodity: "Grapes",
  category: {
    [areaHarvested]: "Area Harvested",
    [yieldInBU]: "Yield"
  },
  dataItem: {
    [areaHarvested]: "Grapes, Organic - Acres Harvested",
    [yieldInBU]: "Grapes - Yield, measured in tons / acre"
  },
  domains: "Total",
  geographicLevels: "State, County",
  years: {
    county: allYears,
    state: allYears
  }
},
{
  plugInAttribute: "Grasses",
  numberOfAttributeColumnsInCodap: 1,
  sector: "Crops",
  group: "Field Crops",
  commodity: "Grasses",
  category: {
    [areaHarvested]: "Area Harvested",
    [yieldInBU]: "Yield"
  },
  dataItem: {
    [areaHarvested]: "",
    [yieldInBU]: ""
  },
  domains: "Total",
  geographicLevels: "State, County",
  years: {
    county: allYears,
    state: allYears
  }
},
{
  plugInAttribute: "Oats",
  numberOfAttributeColumnsInCodap: 1,
  sector: "Crops",
  group: "Field Crops",
  commodity: "Oats",
  category: {
    [areaHarvested]: "Area Harvested",
    [yieldInBU]: "Yield"
  },
  dataItem: {
    [areaHarvested]: "Oats - Acres Harvested",
    [yieldInBU]: "Oats - Yield, measured in BU / acre"
  },
  domains: "Total",
  geographicLevels: "State, County",
  years: {
    county: allYears,
    state: allYears
  }
},
{
  plugInAttribute: "Soybeans",
  numberOfAttributeColumnsInCodap: 1,
  sector: "Crops",
  group: "Field Crops",
  commodity: "Soybeans",
  category: {
    [areaHarvested]: "Area Harvested",
    [yieldInBU]: "Yield"
  },
  dataItem: {
    [areaHarvested]: "Soybeans - Acres Harvested",
    [yieldInBU]: "Soybeans - Yield, measured in BU / acre"
  },
  domains: "Total",
  geographicLevels: "State, County",
  years: {
    county: allYears,
    state: allYears
  }
},
{
  plugInAttribute: "Wheat",
  numberOfAttributeColumnsInCodap: 1,
  sector: "Crops",
  group: "Field Crops",
  commodity: "Wheat",
  category: {
    [areaHarvested]: "Area Harvested",
    [yieldInBU]: "Yield"
  },
  dataItem: {
    [areaHarvested]: "Wheat - Acres Harvested",
    [yieldInBU]: "Wheat - Yield, measured in BU / acre"
  },
  domains: "Total",
  geographicLevels: "State, County",
  years: {
    county: allYears,
    state: allYears
  }
}
];
