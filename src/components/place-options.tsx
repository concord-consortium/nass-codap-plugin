import React from "react";
import { placeOptions, stateOptions } from "./constants";
import { IStateOptions } from "./types";
import { Options } from "./options";

import css from "./options.scss";

interface IProps {
  handleSetSelectedOptions: (option: string, value: string|string[]) => void;
  selectedOptions: IStateOptions;
}

export const PlaceOptions: React.FC<IProps> = (props) => {
  const {handleSetSelectedOptions, selectedOptions} = props;

  const commonProps = {selectedOptions, handleSetSelectedOptions};

  return (
    <>
      <div className={css.instruction}>{placeOptions.label}:</div>
      <div className={css.radioOptions}>
        <Options
          options={placeOptions.options}
          optionKey="geographicLevel"
          inputType="radio"
          { ...commonProps}
        />
      </div>
      <div className={css.instruction}>{stateOptions.label}:</div>
      <div className={css.checkOptions}>
        <Options
          options={stateOptions.options}
          optionKey="states"
          inputType="checkbox"
          {...commonProps}
        />
      </div>
    </>
  );
};
