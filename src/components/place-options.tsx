import React from "react";
import { placeOptions } from "./constants";
import { IStateOptions } from "./types";
import { Options } from "./options";

import css from "./options.scss";

interface IProps {
  handleSetSelectedOptions: (option: string, value: string|string[]) => void;
  selectedOptions: IStateOptions;
}

export const PlaceOptions: React.FC<IProps> = (props) => {
  const {handleSetSelectedOptions, selectedOptions} = props;
  return (
    <>
      {placeOptions.map((placeOpt) => {
        return (
          <>
            <div key={`instructions-${placeOpt.key}`} className={css.instruction}>{placeOpt.instructions}:</div>
            <div key={`options-container-${placeOpt.key}`} className={placeOpt.key === "geographicLevel" ? css.radioOptions : css.checkOptions}>
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
