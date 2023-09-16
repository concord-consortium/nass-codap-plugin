export interface IStateOptions {
  geographicLevel: string,
  states: string[]
  farmerDemographics: string[],
  farmDemographics: string[],
  economicsAndWages: string[],
  cropUnits: string,
  crops: string[]
  years: string[]
}

export type OptionKey = keyof IStateOptions;

export interface IAttrOptions {
  key: keyof IStateOptions,
  label: string|null,
  options: string[],
  instructions: string|null
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
};