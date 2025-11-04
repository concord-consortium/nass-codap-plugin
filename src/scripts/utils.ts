import { queryData } from "../constants/queryHeaders";
import { IStateOptions } from "../constants/types";

export const flatten = (arr: any[]): any[] => {
  return arr.reduce((acc: any[], val: any) =>
    Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []);
};

export const getQueryParams = (attribute: string) => {
  return queryData.find((d) => d.plugInAttribute === attribute);
};

export const isDefaultSelection = (selectedOptions: IStateOptions, defaultOptions: IStateOptions): boolean => {
  return Object.keys(defaultOptions).every((key) => {
    const selected = selectedOptions[key as keyof IStateOptions];
    const defaultVal = defaultOptions[key as keyof IStateOptions];

    if (Array.isArray(selected) && Array.isArray(defaultVal)) {
      return selected.length === defaultVal.length && 
             selected.every((item, index) => item === defaultVal[index]);
    }

    return selected === defaultVal;
  });
};
