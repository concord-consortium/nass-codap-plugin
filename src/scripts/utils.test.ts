import { flatten, getQueryParams, isDefaultSelection } from "./utils";
import { IStateOptions } from "../constants/types";

describe("utils", () => {
  describe("flatten", () => {
    it("should flatten a nested array", () => {
      const input = [1, [2, 3], [4, [5, 6]]];
      const expected = [1, 2, 3, 4, 5, 6];
      expect(flatten(input)).toEqual(expected);
    });

    it("should handle an already flat array", () => {
      const input = [1, 2, 3, 4];
      const expected = [1, 2, 3, 4];
      expect(flatten(input)).toEqual(expected);
    });

    it("should handle an empty array", () => {
      const input: any[] = [];
      const expected: any[] = [];
      expect(flatten(input)).toEqual(expected);
    });

    it("should handle arrays with mixed types", () => {
      const input = ["a", [1, "b"], [true, [null, "c"]]];
      const expected = ["a", 1, "b", true, null, "c"];
      expect(flatten(input)).toEqual(expected);
    });

    it("should handle deeply nested arrays", () => {
      const input = [1, [2, [3, [4, [5]]]]];
      const expected = [1, 2, 3, 4, 5];
      expect(flatten(input)).toEqual(expected);
    });
  });

  describe("getQueryParams", () => {
    it("should return the correct query params for a valid attribute", () => {
      const result = getQueryParams("Total Farmers");
      expect(result).toBeDefined();
      expect(result?.plugInAttribute).toBe("Total Farmers");
    });

    it("should return undefined for an invalid attribute", () => {
      const result = getQueryParams("Nonexistent Attribute");
      expect(result).toBeUndefined();
    });

    it("should return the correct query params for livestock attributes", () => {
      const result = getQueryParams("Cattle");
      expect(result).toBeDefined();
      expect(result?.plugInAttribute).toBe("Cattle");
      expect(result?.group_desc).toBe("Livestock");
    });

    it("should return the correct query params for crop attributes", () => {
      const result = getQueryParams("Corn");
      expect(result).toBeDefined();
      expect(result?.plugInAttribute).toBe("Corn");
      expect(result?.group_desc).toBe("Field Crops");
    });
  });

  describe("isDefaultSelection", () => {
    const defaultOptions: IStateOptions = {
      geographicLevel: "State",
      states: ["All States"],
      farmerDemographics: [],
      farmDemographics: [],
      economicsAndWages: [],
      cropUnits: [],
      crops: [],
      livestock: [],
      years: []
    };

    it("should return true when selections match defaults exactly", () => {
      const selectedOptions: IStateOptions = {
        geographicLevel: "State",
        states: ["All States"],
        farmerDemographics: [],
        farmDemographics: [],
        economicsAndWages: [],
        cropUnits: [],
        crops: [],
        livestock: [],
        years: []
      };

      expect(isDefaultSelection(selectedOptions, defaultOptions)).toBe(true);
    });

    it("should return false when geographic level differs", () => {
      const selectedOptions: IStateOptions = {
        ...defaultOptions,
        geographicLevel: "County"
      };

      expect(isDefaultSelection(selectedOptions, defaultOptions)).toBe(false);
    });

    it("should return false when states array differs", () => {
      const selectedOptions: IStateOptions = {
        ...defaultOptions,
        states: ["California", "Texas"]
      };

      expect(isDefaultSelection(selectedOptions, defaultOptions)).toBe(false);
    });

    it("should return false when array has different length", () => {
      const selectedOptions: IStateOptions = {
        ...defaultOptions,
        farmerDemographics: ["Total Farmers"]
      };

      expect(isDefaultSelection(selectedOptions, defaultOptions)).toBe(false);
    });

    it("should return false when array has same length but different content", () => {
      const selectedOptions: IStateOptions = {
        ...defaultOptions,
        states: ["California"]
      };

      expect(isDefaultSelection(selectedOptions, defaultOptions)).toBe(false);
    });

    it("should return true when multiple arrays match exactly", () => {
      const modifiedDefaults: IStateOptions = {
        ...defaultOptions,
        crops: ["Corn", "Wheat"],
        livestock: ["Cattle"],
        years: ["2023", "2022"]
      };

      const selectedOptions: IStateOptions = {
        ...modifiedDefaults
      };

      expect(isDefaultSelection(selectedOptions, modifiedDefaults)).toBe(true);
    });

    it("should handle empty arrays correctly", () => {
      const selectedOptions: IStateOptions = {
        ...defaultOptions,
        farmerDemographics: [],
        farmDemographics: [],
        economicsAndWages: []
      };

      expect(isDefaultSelection(selectedOptions, defaultOptions)).toBe(true);
    });

    it("should return false when only one property differs among many", () => {
      const modifiedDefaults: IStateOptions = {
        ...defaultOptions,
        crops: ["Corn", "Wheat"],
        livestock: ["Cattle"],
        years: ["2023", "2022"],
        farmerDemographics: ["Age", "Gender"]
      };

      const selectedOptions: IStateOptions = {
        ...modifiedDefaults,
        farmerDemographics: ["Age", "Gender", "Race"]
      };

      expect(isDefaultSelection(selectedOptions, modifiedDefaults)).toBe(false);
    });

    it("should return true when arrays have same elements in different order", () => {
      const defaultsWithOrder: IStateOptions = {
        ...defaultOptions,
        crops: ["Corn", "Wheat", "Soybeans"],
        years: ["2023", "2022", "2021"]
      };

      const selectedWithDifferentOrder: IStateOptions = {
        ...defaultOptions,
        crops: ["Wheat", "Soybeans", "Corn"],
        years: ["2021", "2023", "2022"]
      };

      expect(isDefaultSelection(selectedWithDifferentOrder, defaultsWithOrder)).toBe(true);
    });

    it("should return false when arrays have different elements despite same length", () => {
      const defaultsWithItems: IStateOptions = {
        ...defaultOptions,
        livestock: ["Cattle", "Chickens", "Horses & Ponies"]
      };

      const selectedWithDifferentItems: IStateOptions = {
        ...defaultOptions,
        livestock: ["Cattle", "Hogs", "Horses & Ponies"]
      };

      expect(isDefaultSelection(selectedWithDifferentItems, defaultsWithItems)).toBe(false);
    });

    it("should handle mixed types in arrays when comparing order-independently", () => {
      const defaultsWithMixed: IStateOptions = {
        ...defaultOptions,
        states: ["California", "Texas", "New York"]
      };

      const selectedWithMixedOrder: IStateOptions = {
        ...defaultOptions,
        states: ["New York", "California", "Texas"]
      };

      expect(isDefaultSelection(selectedWithMixedOrder, defaultsWithMixed)).toBe(true);
    });
  });
});
