import React from "react";
import { yearsOptions } from "./constants";
import { IStateOptions } from "./types";
import { Options } from "./options";

import css from "./options.scss";

interface IProps {
  handleSetSelectedOptions: (option: string, value: string|string[]) => void;
  selectedOptions: IStateOptions;
}

export const YearsOptions: React.FC<IProps> = (props) => {
  const {handleSetSelectedOptions, selectedOptions} = props;
  return (
    <div className={css.checkOptions}>
      <Options
        options={yearsOptions.options}
        optionKey={yearsOptions.key}
        inputType={"checkbox"}
        selectedOptions={selectedOptions}
        handleSetSelectedOptions={handleSetSelectedOptions}
      />
    </div>
  );
};
