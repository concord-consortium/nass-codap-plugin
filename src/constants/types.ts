export type GeographicLevel = "County"|"State";

export interface IStateOptions {
  geographicLevel: GeographicLevel;
  states: string[];
  farmerDemographics: string[];
  farmDemographics: string[];
  economicsAndWages: string[];
  cropUnits: string[];
  crops: string[];
  livestock: string[];
  years: string[]
}

export type OptionKey = keyof IStateOptions;

export interface IAttrOptions {
  key: keyof IStateOptions;
  label: string|null;
  options: string[];
  instructions: string|null;
}

export interface IResData {
  "CV (%)": string;
  Value: string;
  agg_level_desc: string;
  asd_code: string;
  asd_desc: string;
  begin_code: string;
  class_desc: string;
  commodity_desc: string;
  congr_district_code: string;
  country_code: string;
  country_name: string;
  county_ansi: string;
  county_code: string;
  county_name: string;
  domain_desc: string;
  domaincat_desc: string;
  end_code: string;
  freq_desc: string;
  group_desc: string;
  load_time: string;
  location_desc: string;
  prodn_practice_desc: string;
  reference_period_desc: string;
  region_desc: string;
  sector_desc: string;
  short_desc: string;
  source_desc: string;
  state_alpha: string;
  state_ansi: string;
  state_fips_code: string;
  state_name: string;
  statisticcat_desc: string;
  unit_desc: string;
  util_practice_desc: string;
  watershed_code: string;
  watershed_desc: string;
  week_ending: string;
  year: number;
  zip_5: string;
}

export interface ICropCategory {
  ["Area Harvested"]: string;
  ["Production"]: string;
  ["Yield"]: string;
}

export interface ICropDataItem {
  ["Area Harvested"]: string[];
  ["Production"]: string[];
  ["Yield"]: string[];
}

export interface ILivestockCategory {
  ["Inventory"]: string;
}

export interface ILivestockDataItem {
  ["Inventory"]?: string[];
  ["Inventory, Broilers"]?: string[];
  ["Inventory, Layers"]?: string[];
}

export interface IQueryHeaders {
  plugInAttribute: string;
  sect_desc: string;
  group_desc: string;
  commodity_desc: string;
  statisticcat_desc: string|ICropCategory|ILivestockCategory;
  short_desc: string[]|ICropDataItem|ILivestockDataItem;
  domain_desc: string;
  geographicAreas: string[];
  years: {
    "County": string[];
    "State": string[];
  }
}

export type ISetReqCount = (value: React.SetStateAction<IReqCount>) => void;

export interface IReqCount {
  total: number;
  completed: number;
}

export interface Attribute {
  name: string;
  formula?: string;
  formulaDependents?: string;
  description?: string;
  type?: string;
  cid?: string;
  precision?: string;
  unit?: string;
  editable?: boolean;
  renameable?: boolean;
  deleteable?: boolean;
  hidden?: boolean;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export const isCropCategory = (desc: unknown): desc is ICropCategory => {
  return isObject(desc) && 
         "Area Harvested" in desc && 
         typeof desc["Area Harvested"] === "string";
};

export const isCropDataItem = (desc: unknown): desc is ICropDataItem => {
  return isObject(desc) && 
         "Area Harvested" in desc && 
         Array.isArray(desc["Area Harvested"]) &&
         desc["Area Harvested"].every((item: unknown) => typeof item === "string");
};

export const isLivestockCategory = (desc: unknown): desc is ILivestockCategory => {
  return isObject(desc) && 
         "Inventory" in desc && 
         typeof desc.Inventory === "string";
};

export const isLivestockDataItem = (desc: unknown): desc is ILivestockDataItem => {
  if (!isObject(desc)) return false;
  
  // Check for standard livestock with "Inventory" key
  if ("Inventory" in desc && Array.isArray(desc.Inventory) && 
      desc.Inventory.every((item: unknown) => typeof item === "string")) {
    return true;
  }
  
  // Checks for chickens with "Inventory, Broilers" and/or "Inventory, Layers" keys
  const hasValidBroilers = "Inventory, Broilers" in desc && 
    Array.isArray(desc["Inventory, Broilers"]) &&
    desc["Inventory, Broilers"].every((item: unknown) => typeof item === "string");
    
  const hasValidLayers = "Inventory, Layers" in desc && 
    Array.isArray(desc["Inventory, Layers"]) &&
    desc["Inventory, Layers"].every((item: unknown) => typeof item === "string");
  
  return hasValidBroilers || hasValidLayers;
};

export const isCropDataItemKey = (key: string): key is keyof ICropDataItem => {
  return key === "Area Harvested" || key === "Production" || key === "Yield";
};

export const isLivestockDataItemKey = (key: string): key is keyof ILivestockDataItem => {
  return key === "Inventory" || key === "Inventory, Broilers" || key === "Inventory, Layers";
};
