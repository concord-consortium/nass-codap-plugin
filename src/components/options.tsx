import React from "react";
import { IStateOptions, OptionKey } from "../constants/types";

import css from "./options.scss";

export interface IOptions {
  options: string[],
  selectedOptions: IStateOptions,
  inputType: "radio" | "checkbox",
  handleSetSelectedOptions: (option: string, value: string|string[]) => void,
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
      let newArray = [...selectedOptions[optionKey]];
      if (e.currentTarget.checked) {
        newArray.push(e.target.value);
        newArray.sort();
        if (optionKey === "years") {
          newArray.reverse();
        }
      } else {
        if (isOptionSelected(e.target.value)) {
          newArray = newArray.filter((o) => o !== e.target.value);
        }
      }
      handleSetSelectedOptions(optionKey, newArray);
    } else if (optionKey === "geographicLevel" || optionKey === "cropUnits") {
      handleSetSelectedOptions(optionKey, e.target.value);
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
