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
  "PRODUCERS, AMERICAN INDIAN OR ALASKAN NATIVE - NUMBER OF PRODUCERS": {
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
  "PRODUCERS, NATIVE HAWAIIAN OR OTHER PACIFIC ISLANDERS - NUMBER OF PRODUCERS": {
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
  "FARM OPERATIONS, ORGANIZATION, TAX PURPOSES, CORPORATION (EXCL FAMILY HELD) - NUMBER OF OPERATIONS": {
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
  "COTTON, - YIELD, MEASURED IN LB / ACRE": {
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
  "GRAPES, ORGANIC - ACRES HARVESTED": {
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
  "SOYBEANS - YIELD MEASURED IN BU / ACRE": {
    "attributeNameInCodapTable": "Soybeans Yield",
    "unitInCodapTable": "BU/Acre"
  },
  "SOYBEANS - ACRES HARVESTED": {
    "attributeNameInCodapTable": "Soybeans Area Harvested",
    "unitInCodapTable": "Acres Harvested"
  },
  "WHEAT - YIELD MEASURED IN BU / ACRE": {
    "attributeNameInCodapTable": "Wheat Yield",
    "unitInCodapTable": "BU/Acre"
  },
  "WHEAT - ACRES HARVESTED": {
    "attributeNameInCodapTable": "Wheat Area Harvested",
    "unitInCodapTable": "Acres Harvested"
  }
};
