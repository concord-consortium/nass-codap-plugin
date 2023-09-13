export interface IStateOptions {
  "geographicLevel": string,
  "states": string[]
  "farmerDemographics": string[],
  "farmDemographics": string[],
  "economicsAndWages": string[],
  "cropUnits": string,
  "crops": string[]
  "years": string[]
}

export type OptionKey = keyof IStateOptions;

export interface IAttrOptions {
  key: keyof IStateOptions,
  label: string|null,
  options: string[]
  instructions: string|null
}
