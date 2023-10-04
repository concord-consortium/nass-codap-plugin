import React from "react";
import { IStateOptions, OptionKey } from "../constants/types";

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
      const newSelection: any = {[optionKey]: newArray};
      if (e.currentTarget.checked) {
        newSelection[optionKey].push(e.target.value);
        // If user selects "Age", "Gender", or "Race", auto-select "Total Farmers" as well
        if (optionKey === "farmerDemographics" && !newArray.includes("Total Farmers")) {
          newSelection.farmerDemographics.push("Total Farmers");
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
          const includes = (opt: string) => selectedOptions.farmerDemographics.includes(opt);
          // "Total Farmers" can only be unselected if race, gender, and age are unselected
          if (optionKey === "farmerDemographics" && e.target.value === "Total Farmers") {
            const shouldFilter = !includes("Race") && !includes("Gender") && !includes("Age");
            if (shouldFilter) {
              newSelection[optionKey] = newArray.filter((o) => o !== e.target.value);
            }
          } else if (selectedOptions.crops.includes(e.target.value)) {
            // If user is de-selecting a crop, check that there are crops still selected -
            // Otherwise deselect crop units, too
            newSelection.crops = newArray.filter((o) => o !== e.target.value);
            if (newSelection.crops.length === 0) {
              newSelection.cropUnits = "";
            }
          } else {
            newSelection[optionKey] = newArray.filter((o) => o !== e.target.value);
          }
        }
      }
      handleSetSelectedOptions(newSelection);
    } else if (optionKey === "geographicLevel" || optionKey === "cropUnits") {
      handleSetSelectedOptions({[optionKey]: e.target.value});
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
          <label className={css.label} htmlFor={o} key={`label-${o}`}>{o}</label>
        </div>
      );
    })}
    </>
  );
};
