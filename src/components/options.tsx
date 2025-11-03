import React from "react";
import { GeographicLevel, IStateOptions, OptionKey } from "../constants/types";

import css from "./options.scss";

export interface IOptions {
  options: string[],
  selectedOptions: IStateOptions,
  inputType: "radio" | "checkbox",
  handleSetSelectedOptions: (newState: Partial<IStateOptions>) => void
  optionKey: OptionKey
}


export const Options: React.FC<IOptions> = (props) => {
  const {options, selectedOptions, inputType, handleSetSelectedOptions, optionKey} = props;

  const isOptionSelected = (option: string) => {
    if (Array.isArray(selectedOptions[optionKey])) {
      return selectedOptions[optionKey].indexOf(option) > -1;
    } else {
      return selectedOptions[optionKey] === option;
    }
  };

  const handleSelectState = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (Array.isArray(selectedOptions[optionKey])) {
      const newArray = [...selectedOptions[optionKey]];
      const newSelection = {[optionKey]: newArray};
      if (e.currentTarget.checked) {
        newSelection[optionKey].push(e.target.value);
        // If user selects "Age", "Gender", or "Race", auto-select "Total Farmers" as well
        if (optionKey === "farmerDemographics" && !newArray.includes("Total Farmers")) {
          newSelection.farmerDemographics.push("Total Farmers");
        }
        // If user selects any option under Farm Demographics, auto-select "Total Farms" as well
        if (optionKey === "farmDemographics" && !newArray.includes("Total Farms")) {
          newSelection.farmDemographics.push("Total Farms");
        }
        // If user selects a crop and no unit is selected, auto-select Yield
        if (optionKey === "crops" && !selectedOptions.cropUnits.length) {
          newSelection.cropUnits = ["Yield"];
        }
        // If user selects a state, de-select "All States"
        if (optionKey === "states" && newArray.includes("All States")) {
          newSelection.states = newArray.filter((state) => state !== "All States");
        }
        newArray.sort();
        if (optionKey === "years") {
          newSelection.years.reverse();
        }
      } else {
        if (isOptionSelected(e.target.value)) {
          const includesAny = (opts: string[], key: keyof IStateOptions) => opts.some(opt => selectedOptions[key].includes(opt));
          // "Total Farmers" can only be unselected if race, gender, and age are unselected
          if (optionKey === "farmerDemographics" && e.target.value === "Total Farmers") {
            const shouldFilter = !includesAny(["Race", "Gender", "Age"], "farmerDemographics");
            if (shouldFilter) {
              newSelection[optionKey] = newArray.filter((o) => o !== e.target.value);
            }
          } else if (optionKey === "farmDemographics" && e.target.value === "Total Farms") {
            const shouldFilter = !includesAny(["Economic Class", "Acres Operated", "Organic", "Organization Type"], "farmDemographics");
            if (shouldFilter) {
              newSelection[optionKey] = newArray.filter((o) => o !== e.target.value);
            }
          } else if (selectedOptions.crops.includes(e.target.value)) {
            // If user is de-selecting a crop, check that there are crops still selected -
            // Otherwise deselect crop units, too
            newSelection.crops = newArray.filter((o) => o !== e.target.value);
            if (newSelection.crops.length === 0) {
              newSelection.cropUnits = [];
            }
          } else {
            newSelection[optionKey] = newArray.filter((o) => o !== e.target.value);
          }
        }
      }
      handleSetSelectedOptions(newSelection);
    } else if (optionKey === "geographicLevel") {
      handleSetSelectedOptions({geographicLevel: e.target.value as GeographicLevel});
    }
  };

  return (
    <>
    {options.map((o) => {
      return (
        <div key={`${inputType}-option-${o}`} className={css.option}>
          <input
            id={o}
            className={css[inputType]}
            type={inputType}
            key={`${inputType}-${o}`}
            value={o}
            checked={isOptionSelected(o)}
            onChange={(e) => handleSelectState(e)}
          />
          <label className={css.label} htmlFor={o} key={`${inputType}-label-${o}`}>{o}</label>
        </div>
      );
    })}
    </>
  );
};
