interface ICodapColumnData {
  "attributeNameInCodapTable": string,
  "unitInCodapTable": string
}

interface IAttrToCodapColumn {
  [attr: string]: ICodapColumnData
}

export const attrToCODAPColumnName: IAttrToCodapColumn = {
  "PRODUCERS, (ALL) - NUMBER OF PRODUCERS": {
    "attributeNameInCodapTable": "Total Number of Farmers",
    "unitInCodapTable": "# of Farmers"
  },
  "OPERATORS, (ALL) - NUMBER OF OPERATORS": {
    "attributeNameInCodapTable": "Total Number of Farmers",
    "unitInCodapTable": "# of Farmers"
  },
  "PRODUCERS, AGE LT 25 - NUMBER OF PRODUCERS": {
    "attributeNameInCodapTable": "Age < 25",
    "unitInCodapTable": "# of Farmers"
  },
  "PRODUCERS, AGE 25 TO 34 - NUMBER OF PRODUCERS": {
    "attributeNameInCodapTable": "Age 25 - 34",
    "unitInCodapTable": "# of Farmers"
  },
  "PRODUCERS, AGE 35 TO 44 - NUMBER OF PRODUCERS": {
    "attributeNameInCodapTable": "Age 35 - 44",
    "unitInCodapTable": "# of Farmers"
  },
  "PRODUCERS, AGE 45 TO 54 - NUMBER OF PRODUCERS": {
    "attributeNameInCodapTable": "Age 45 - 54",
    "unitInCodapTable": "# of Farmers"
  },
  "PRODUCERS, AGE 55 TO 64 - NUMBER OF PRODUCERS": {
    "attributeNameInCodapTable": "Age 55 - 64",
    "unitInCodapTable": "# of Farmers"
  },
  "PRODUCERS, AGE 65 TO 74 - NUMBER OF PRODUCERS": {
    "attributeNameInCodapTable": "Age 65 - 74",
    "unitInCodapTable": "# of Farmers"
  },
  "PRODUCERS, AGE GE 75 - NUMBER OF PRODUCERS": {
    "attributeNameInCodapTable": "Age > 74",
    "unitInCodapTable": "# of Farmers"
  },
  "PRODUCERS, (ALL), FEMALE - NUMBER OF PRODUCERS": {
    "attributeNameInCodapTable": "Female",
    "unitInCodapTable": "# of Farmers"
  },
  "PRODUCERS, (ALL), MALE - NUMBER OF PRODUCERS": {
    "attributeNameInCodapTable": "Male",
    "unitInCodapTable": "# of Farmers"
  },
  "PRODUCERS, AMERICAN INDIAN OR ALASKA NATIVE - NUMBER OF PRODUCERS": {
    "attributeNameInCodapTable": "American Indian or Alaskan Native",
    "unitInCodapTable": "# of Farmers"
  },
  "PRODUCERS, ASIAN - NUMBER OF PRODUCERS": {
    "attributeNameInCodapTable": "Asian",
    "unitInCodapTable": "# of Farmers"
  },
  "PRODUCERS, BLACK OR AFRICAN AMERICAN - NUMBER OF PRODUCERS": {
    "attributeNameInCodapTable": "Black or African American",
    "unitInCodapTable": "# of Farmers"
  },
  "PRODUCERS, HISPANIC - NUMBER OF PRODUCERS": {
    "attributeNameInCodapTable": "Hispanic",
    "unitInCodapTable": "# of Farmers"
  },
  "PRODUCERS, MULTI-RACE - NUMBER OF PRODUCERS": {
    "attributeNameInCodapTable": "Multi-race",
    "unitInCodapTable": "# of Farmers"
  },
  "PRODUCERS, NATIVE HAWAIIAN OR OTHER PACIFIC ISLANDER - NUMBER OF PRODUCERS": {
    "attributeNameInCodapTable": "Native Hawaiian or Other Pacific Islanders",
    "unitInCodapTable": "# of Farmers"
  },
  "PRODUCERS, WHITE - NUMBER OF PRODUCERS": {
    "attributeNameInCodapTable": "White",
    "unitInCodapTable": "# of Farmers"
  },
  "FARM OPERATIONS - NUMBER OF OPERATIONS": {
    "attributeNameInCodapTable": "Total Number of Farms",
    "unitInCodapTable": "# of Farms"
  },
  "FARM OPERATIONS, ORGANIZATION, TAX PURPOSES, CORPORATION, (EXCL FAMILY HELD) - NUMBER OF OPERATIONS": {
    "attributeNameInCodapTable": "Corporate",
    "unitInCodapTable": "# of Farms"
  },
  "FARM OPERATIONS, ORGANIZATION, TAX PURPOSES, CORPORATION, FAMILY HELD - NUMBER OF OPERATIONS": {
    "attributeNameInCodapTable": "Corporate, Family Held",
    "unitInCodapTable": "# of Farms"
  },
  "FARM OPERATIONS, ORGANIZATION, TAX PURPOSES, FAMILY & INDIVIDUAL - NUMBER OF OPERATIONS": {
    "attributeNameInCodapTable": "Family & Individual",
    "unitInCodapTable": "# of Farms"
  },
  "FARM OPERATIONS, ORGANIZATION, TAX PURPOSES, INSTITUTIONAL & RESEARCH & RESERVATION & OTHER - NUMBER OF OPERATIONS": {
    "attributeNameInCodapTable": "Institutional, Research, Reservation, & Other",
    "unitInCodapTable": "# of Farms"
  },
  "FARM OPERATIONS, ORGANIZATION, TAX PURPOSES, PARTNERSHIP - NUMBER OF OPERATIONS": {
    "attributeNameInCodapTable": "Partnership",
    "unitInCodapTable": "# of Farms"
  },
  "FARM OPERATIONS - ACRES OPERATED": {
    "attributeNameInCodapTable": "",
    "unitInCodapTable": "# of Farms"
  },
  "FARM OPERATIONS, ORGANIC - NUMBER OF OPERATIONS": {
    "attributeNameInCodapTable": "Organic",
    "unitInCodapTable": "# of Farms"
  },
  "LABOR, MIGRANT - NUMBER OF WORKERS": {
    "attributeNameInCodapTable": "Migrant",
    "unitInCodapTable": "# of Farm Laborers"
  },
  "LABOR, UNPAID - NUMBER OF WORKERS": {
    "attributeNameInCodapTable": "Unpaid",
    "unitInCodapTable": "# of Farm Laborers"
  },
  "LABOR, HIRED - NUMBER OF WORKERS": {
    "attributeNameInCodapTable": "Hired",
    "unitInCodapTable": "# of Farm Laborers"
  },
  "LABOR, HIRED - WAGE RATE, MEASURED IN $ / HOUR": {
    "attributeNameInCodapTable": "Wage Rate of Laborers",
    "unitInCodapTable": "$/Hour"
  },
  "LABOR, HIRED - TIME WORKED, MEASURED IN HOURS / WEEK": {
    "attributeNameInCodapTable": "Time Worked by Laborers",
    "unitInCodapTable": "Hours/Week"
  },
  "CORN, GRAIN - YIELD, MEASURED IN BU / ACRE": {
    "attributeNameInCodapTable": "Corn Yield",
    "unitInCodapTable": "BU/Acre"
  },
  "CORN, GRAIN - ACRES HARVESTED": {
    "attributeNameInCodapTable": "Corn Area Harvested",
    "unitInCodapTable": "Acres Harvested"
  },
  "COTTON - YIELD, MEASURED IN LB / ACRE": {
    "attributeNameInCodapTable": "Cotton Yield",
    "unitInCodapTable": "LB/Acre"
  },
  "COTTON - ACRES HARVESTED": {
    "attributeNameInCodapTable": "Cotton Area Harvested",
    "unitInCodapTable": "Acres Harvested"
  },
  "GRAPES - YIELD, MEASURED IN TONS / ACRE": {
    "attributeNameInCodapTable": "Grapes Yield",
    "unitInCodapTable": "Tons/Acre"
  },
  "GRAPES - ACRES BEARING": {
    "attributeNameInCodapTable": "Grapes Area Harvested",
    "unitInCodapTable": "Acres Harvested"
  },
  "OATS - YIELD, MEASURED IN BU / ACRE": {
    "attributeNameInCodapTable": "Oats Yield",
    "unitInCodapTable": "BU/Acre"
  },
  "OATS - ACRES HARVESTED": {
    "attributeNameInCodapTable": "Oats Area Harvested",
    "unitInCodapTable": "Acres Harvested"
  },
  "SOYBEANS - YIELD, MEASURED IN BU / ACRE": {
    "attributeNameInCodapTable": "Soybeans Yield",
    "unitInCodapTable": "BU/Acre"
  },
  "SOYBEANS - ACRES HARVESTED": {
    "attributeNameInCodapTable": "Soybeans Area Harvested",
    "unitInCodapTable": "Acres Harvested"
  },
  "WHEAT - YIELD, MEASURED IN BU / ACRE": {
    "attributeNameInCodapTable": "Wheat Yield",
    "unitInCodapTable": "BU/Acre"
  },
  "WHEAT - ACRES HARVESTED": {
    "attributeNameInCodapTable": "Wheat Area Harvested",
    "unitInCodapTable": "Acres Harvested"
  },
  "ECONOMIC CLASS: (1,000 TO 9,999 $)": {
    "attributeNameInCodapTable": "Small Farm ($1,000 - $9,999)",
    "unitInCodapTable": "# of Farms"
  },
  "ECONOMIC CLASS: (10,000 TO 99,999 $)": {
    "attributeNameInCodapTable": "Small Medium Farm ($10,000 - $99,000)",
    "unitInCodapTable": "# of Farms"
  },
  "ECONOMIC CLASS: (100,000 TO 249,999 $)": {
    "attributeNameInCodapTable": "Medium Farm ($100,000 - $249,000)",
    "unitInCodapTable": "# of Farms"
  },
  "ECONOMIC CLASS: (250,000 TO 499,999 $)": {
    "attributeNameInCodapTable": "Medium Large Farm ($250,000 - $499,999)",
    "unitInCodapTable": "# of Farms"
  },
  "ECONOMIC CLASS: (500,000 TO 999,999 $)": {
    "attributeNameInCodapTable": "Large Farm ($500,000 - $999,999)",
    "unitInCodapTable": "# of Farms"
  },
  "ECONOMIC CLASS: (1,000,000 OR MORE $)": {
    "attributeNameInCodapTable": "Very Large Farm ($1 million or more)",
    "unitInCodapTable": "# of Farms"
  },
  "AREA OPERATED: (1.0 TO 9.9 ACRES)": {
    "attributeNameInCodapTable": "Less than 10 Acres",
    "unitInCodapTable": "# of Farms"
  },
  "AREA OPERATED: (10.0 TO 49.9 ACRES)": {
    "attributeNameInCodapTable": "10 - 50 Acres",
    "unitInCodapTable": "# of Farms"
  },
  "AREA OPERATED: (50.0 TO 100 ACRES)": {
    "attributeNameInCodapTable": "50 - 100 Acres",
    "unitInCodapTable": "# of Farms"
  },
  "AREA OPERATED: (100 TO 500 ACRES)": {
    "attributeNameInCodapTable": "100 - 500 Acres",
    "unitInCodapTable": "# of Farms"
  },
  "AREA OPERATED: (500 TO 999 ACRES)": {
    "attributeNameInCodapTable": "500 - 1,000 Acres",
    "unitInCodapTable": "# of Farms"
  },
  "AREA OPERATED: (1,000 TO 5,000 ACRES)": {
    "attributeNameInCodapTable": "1,000 - 5,000 Acres",
    "unitInCodapTable": "# of Farms"
  },
  "AREA OPERATED: (5,000 OR MORE ACRES)": {
    "attributeNameInCodapTable": "5,000 Acres or More",
    "unitInCodapTable": "# of Farms"
  }
};

export const economicClassAttirbutes = [
  "ECONOMIC CLASS: (1,000 TO 9,999 $)",
  "ECONOMIC CLASS: (10,000 TO 99,999 $)",
  "ECONOMIC CLASS: (100,000 TO 249,999 $)",
  "ECONOMIC CLASS: (250,000 TO 499,999 $)",
  "ECONOMIC CLASS: (500,000 TO 999,999 $)",
  "ECONOMIC CLASS: (1,000,000 OR MORE $)"
];

export const acresOperatedAttributes = [
  "AREA OPERATED: (1.0 TO 9.9 ACRES)",
  "AREA OPERATED: (10.0 TO 49.9 ACRES)",
  "AREA OPERATED: (50.0 TO 100 ACRES)",
  "AREA OPERATED: (100 TO 500 ACRES)",
  "AREA OPERATED: (500 TO 999 ACRES)",
  "AREA OPERATED: (1,000 TO 5,000 ACRES)",
  "AREA OPERATED: (5,000 OR MORE ACRES)"
];
