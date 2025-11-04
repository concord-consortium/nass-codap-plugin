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
      if (selected.length !== defaultVal.length) {
        return false;
      }

      // Sort both arrays to compare regardless of order
      const sortedSelected = [...selected].sort();
      const sortedDefault = [...defaultVal].sort();
      return sortedSelected.every((item, index) => item === sortedDefault[index]);
    }

    return selected === defaultVal;
  });
};
