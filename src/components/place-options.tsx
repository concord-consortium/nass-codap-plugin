import React from "react";
import { placeOptions } from "../constants/constants";
import { IStateOptions } from "../constants/types";
import { Options } from "./options";

import css from "./options.scss";

interface IProps {
  handleSetSelectedOptions: (newState: Partial<IStateOptions>) => void;
  selectedOptions: IStateOptions;
}

export const PlaceOptions: React.FC<IProps> = (props) => {
  const {handleSetSelectedOptions, selectedOptions} = props;

  const isAllStatesSelected = () => {
    return selectedOptions.states[0] === "All States";
  };

  const handleSelectAllStates = () => {
    handleSetSelectedOptions({states: ["All States"]});
  };

  return (
    <>
      {placeOptions.map((placeOpt) => {
        return (
          <>
            <div key={`instructions-${placeOpt.key}`} className={css.instruction}>{placeOpt.instructions}:</div>
            <div
              key={`options-container-${placeOpt.key}`}
              className={placeOpt.key === "geographicLevel" ? css.radioOptions : css.checkOptions}
            >
              {placeOpt.key === "states" &&
                <div key={`radio-option-All-States`} className={css.option}>
                  <input
                    id={"All States"}
                    className={css.radio}
                    type={"radio"}
                    key={`radio-All-States`}
                    value={"All States"}
                    checked={isAllStatesSelected()}
                    onChange={handleSelectAllStates}
                  />
                  <label className={css.label} htmlFor={"All States"} key={`label-${"All States"}`}>
                    {"All States"}
                  </label>
                </div>
              }
              <Options
                key={`options-${placeOpt.key}`}
                options={placeOpt.options}
                optionKey={placeOpt.key}
                inputType={placeOpt.key === "geographicLevel" ? "radio" : "checkbox"}
                selectedOptions={selectedOptions}
                handleSetSelectedOptions={handleSetSelectedOptions}
              />
            </div>
          </>
        );
      })}
    </>
  );
};
