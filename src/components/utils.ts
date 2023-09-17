export const flatten = (arr: any[]): any[] => {
  return arr.reduce((acc: any[], val: any) =>
    Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []);
};
