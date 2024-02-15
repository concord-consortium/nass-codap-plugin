import { IAttrOptions, IStateOptions } from "./types";

export const geographicLevelOptions: IAttrOptions = {
  label: null,
  key: "geographicLevel",
  instructions: "Size of area for data",
  options : ["State", "County"]
};

export const fiftyStates = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming"
];

export const stateOptions: IAttrOptions = {
  label: null,
  key: "states",
  instructions: "Choose states to include in your dataset from the list below",
  options: [
    ...fiftyStates
  ]
};

export const placeOptions = [geographicLevelOptions, stateOptions];

const farmerOptions: IAttrOptions = {
  key: "farmerDemographics",
  label: "Farmer Demographics",
  options: ["Total Farmers", "Age", "Race", "Gender"],
  instructions: null
};
const farmOptions: IAttrOptions = {
  key: "farmDemographics",
  label: "Farm Demographics",
  options: ["Total Farms", "Organization Type", "Economic Class", "Acres Operated", "Organic"],
  instructions: null
};
const economicOptions: IAttrOptions = {
  key: "economicsAndWages",
  label: "Economics & Wages",
  options: ["Labor Status", "Wages", "Time Worked"],
  instructions: null
};
const cropUnitOptions: IAttrOptions = {
  key: "cropUnits",
  label: "Crop Production",
  options: ["Area Harvested", "Yield"],
  instructions: "(Choose unit)"
};
export const cropOptions: IAttrOptions = {
  key: "crops",
  label: null,
  options: ["Corn", "Cotton", "Grapes", "Oats", "Soybeans", "Wheat"],
  instructions: "(Choose crops)"
};

export const attributeOptions = [farmerOptions, farmOptions, economicOptions, cropUnitOptions, cropOptions];

const yearsArray = [];
for (let year = 2022; year >= 1910; year--) {
  yearsArray.push(`${year}`);
}

export const yearsOptions: IAttrOptions = {
  key: "years",
  label: "Years",
  options: yearsArray,
  instructions: null
};

export const categories = [
  {header: "Place", options: placeOptions, altText: ""},
  {header: "Attributes", options: attributeOptions, altText: ""},
  {header: "Years", options: yearsOptions, altText: ""}
];

export const defaultSelectedOptions: IStateOptions = {
  geographicLevel: "State",
  states: ["All States"],
  farmerDemographics: [],
  farmDemographics: [],
  economicsAndWages: [],
  cropUnits: [],
  crops: [],
  years: []
};
