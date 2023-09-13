
interface IQueryHeaders {
  plugInAttribute: string,
  numberOfAttributeColumnsInCodap: number|string,
  sector: string,
  group: string,
  commodity: string,
  category: string
  dataItem: string|string[],
  domains: string,
  geographicLevels?: string,
  years?: string
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

export const queryData: Array<IQueryHeaders> = [
{
    plugInAttribute: "Total Farmers",
    numberOfAttributeColumnsInCodap: 1,
    ...sharedDemographicHeaders,
    dataItem: "PRODUCERS, (ALL) - NUMBER OF PRODUCERS",
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

},
{
    plugInAttribute: "Gender",
    numberOfAttributeColumnsInCodap: 2,
    ...sharedDemographicHeaders,
    dataItem: [
      "PRODUCERS, (ALL), FEMALE - NUMBER OF PRODUCERS",
      "PRODUCERS, (ALL), MALE - NUMBER OF PRODUCERS"
    ],
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
    ]
},
{
    plugInAttribute: "Total Farms",
    numberOfAttributeColumnsInCodap: 1,
    ...sharedEconomicHeaders,
    dataItem: "Farm Operations - Number of Operations",
    domains: "Total",
    geographicLevels: "State, County",
    years: "1910 - 2022"
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
    years: "County: 1997, 2002, 2007, 2012, 2017\nState: 1910 - 2022"
},
{
    plugInAttribute: "Economic Class",
    numberOfAttributeColumnsInCodap: "3 - 6",
    ...sharedEconomicHeaders,
    dataItem: "Farm Operations - Number of Operations",
    domains: "Economic Class",
    geographicLevels: "State ",
    years: "1987 - 2022"
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
    years: "1997, 2002, 2007, 2012, 2017"
},
{
    plugInAttribute: "Organic",
    numberOfAttributeColumnsInCodap: 1,
    ...sharedEconomicHeaders,
    dataItem: "Farm Operations, Organic - Number of Operations",
    domains: "Organic Status"
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
    years: "2012, 2017"
},
{
    plugInAttribute: "Wages",
    numberOfAttributeColumnsInCodap: 1,
    ...sharedLaborHeaders,
    category: "Wage Rate",
    dataItem: "LABOR, HIRED - WAGE RATE, MEASURED IN $/HOUR",
    domains: "Total",
    geographicLevels: "Region: Multi-state",
    years: "1989 - 2022",
},
{
    plugInAttribute: "Time Worked",
    numberOfAttributeColumnsInCodap: 1,
    ...sharedLaborHeaders,
    category: "Wage Rate",
    dataItem: "Labor, Hired - Time Worked, Measured in Hours/Week",
    domains: "Total",
    geographicLevels: "Region: Multi-state",
    years: "1989 - 2022",
},
{
    plugInAttribute: "Corn",
    numberOfAttributeColumnsInCodap: 1,
    sector: "Crops",
    group: "Field Crops",
    commodity: "Corn",
    category: "Yield",
    dataItem: "Corn, Grain - Yield, measured in BU / acre",
    domains: "Total",
    geographicLevels: "State, County",
    years: "County: 1910 - 2022\nState:1866 - 2022 (only add 1910 - 2022)",
}
];
