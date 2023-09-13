import { IAttrOptions, IStateOptions } from "./types";

export const placeOptions = {
  label: "Size of area for data",
  options : ["State", "County"]
};

export const stateOptions = {
  label: "Choose states to include in your dataset from the list below",
  options: [
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
  ]
};

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
  label: "Production",
  options: ["Area Harvested", "Yield"],
  instructions: "(Choose units)"
};
const cropOptions: IAttrOptions = {
  key: "crops",
  label: null,
  options: ["Corn", "Cotton", "Grapes", "Grasses", "Oats", "Soybeans", "Wheat"],
  instructions: "(Choose crops)"
};

export const attributeOptions = [farmerOptions, farmOptions, economicOptions, cropUnitOptions, cropOptions];

export const defaultSelectedOptions: IStateOptions = {
  "geographicLevel": "",
  "states": [],
  "farmerDemographics": [],
  "farmDemographics": [],
  "economicsAndWages": [],
  "cropUnits": "",
  "crops": [],
  "years": []
};
