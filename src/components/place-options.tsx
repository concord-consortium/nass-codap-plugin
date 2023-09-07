import React from "react";
import { placeOptions, stateOptions } from "./constants";

import css from "./options.scss";

interface IProps {
  handleSetSelectedOptions: (option: string, value: string|string[]) => void;
  selectedPlace: string|null;
  selectedStates: string[];
}

export const PlaceOptions: React.FC<IProps> = (props) => {
  const {handleSetSelectedOptions, selectedPlace, selectedStates} = props;

  const isStateSelected = (state: string) => {
    return selectedStates.indexOf(state) > - 1;
  };

  const handleSelectPlace = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSetSelectedOptions("place", e.target.value);
  };

  const handleSelectState = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newSelectedStates = [...selectedStates];
    if (e.currentTarget.checked) {
      newSelectedStates.push(e.target.value);
      newSelectedStates.sort();

    } else {
      if (isStateSelected(e.target.value)) {
        newSelectedStates = newSelectedStates.filter((s) => s !== e.target.value);
      }
    }
    handleSetSelectedOptions("states", newSelectedStates);
  };

  const createPlaceOptions = (options: string[]) => {
    return (
      <>
      {options.map((o) => {
        return (
          <div key={`radio-option-${o}`} className={css.option}>
            <input
              className={css.radio}
              id={o}
              type="radio"
              key={`radio-${o}`}
              value={o}
              checked={selectedPlace === o}
              onChange={handleSelectPlace}
            />
            <label className={css.label} htmlFor={o} key={`label-${o}`}>{o}</label>
          </div>
        );
      })}
      </>
    );
  };

  const createStateOptions = (options: string[]) => {
    return (
      <>
      {options.map((o) => {
        return (
          <div key={`checkbox-option-${o}`} className={css.option}>
            <input
              id={o}
              className={css.checkbox}
              type="checkbox"
              key={`checkbox-${o}`}
              value={o}
              checked={isStateSelected(o)}
              onChange={handleSelectState}
            />
            <label className={css.label} htmlFor={o} key={`label-${o}`}>{o}</label>
          </div>
        );
      })}
      </>
    );
  };

  return (
    <>
      <div className={css.instruction}>{placeOptions.label}:</div>
      <div className={css.radioOptions}>{createPlaceOptions(placeOptions.options)}</div>
      <div className={css.instruction}>{stateOptions.label}:</div>
      <div className={css.checkOptions}>{createStateOptions(stateOptions.options)}</div>
    </>
  );
};
