import React from "react";
import { Options } from "./options";
import { attributeOptions } from "../constants/constants";
import classnames from "classnames";
import { IStateOptions } from "../constants/types";

import css from "./options.scss";

interface IProps {
  handleSetSelectedOptions: (newState: Partial<IStateOptions>) => void;
  selectedOptions: IStateOptions;
}

export const AttributeOptions: React.FC<IProps> = (props) => {
  const {handleSetSelectedOptions, selectedOptions} = props;

  const commonProps = {
    handleSetSelectedOptions,
    selectedOptions
  };

  const getClasses = (key: string) => {
    if (key === "cropUnits" || key === "crops") {
      return classnames(css.checkOptions, css.narrow);
    } else {
      return classnames(css.checkOptions, css.vertical);
    }
  };

  return (
    <>
    <div className={css.header}>
      Choose attributes to include in your dataset from the list below.
    </div>
      {
        attributeOptions.map((attr) => {
          return (
            <>
            {attr.label && <div key={`header-${attr.key}`} className={css.statisticcat_desc}>{attr.label}</div>}
            {attr.instructions &&
              <div key={`instructions-${attr.key}`} className={css.instructions}>
                {attr.instructions}
              </div>
            }
            <div key={`options-container-${attr.key}`} className={classnames(getClasses(attr.key))}>
              <Options
                key={`options-${attr.key}`}
                inputType={"checkbox"}
                options={attr.options}
                optionKey={attr.key}
                {...commonProps}
              />
            </div>
            </>
          );
        })
      }
    </>
    );
};
