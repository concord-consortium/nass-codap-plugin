import React, { useState } from "react";
import classnames from "classnames";
import { PlaceOptions } from "./place-options";
import { defaultSelectedOptions } from "./constants";
import { AttributeOptions } from "./attribute-options";

import css from "./dropdown.scss";

interface IProps {
  sectionName: string
  sectionAltText: string
  handleSetSelectedOptions: (option: string, value: string|string[]) => void
  selectedOptions: typeof defaultSelectedOptions;
}

export const Dropdown: React.FC<IProps> = (props) => {
  const {sectionName, sectionAltText, handleSetSelectedOptions, selectedOptions} = props;
  const [showItems, setShowItems] = useState<boolean>(false);

  const handleClick = () => {
    setShowItems(!showItems);
  };

  const renderSummary = () => {
    if (sectionName === "Place") {
      const place = selectedOptions.geographicLevel || "";
      const states = selectedOptions.states.join(`, `);
      return (
        `${place}: ${states}`
      );
    } else if (sectionName === "Attributes") {
      return (
        ""
      )
    }
  }

  const commonProps = {handleSetSelectedOptions, selectedOptions};

  const renderOptions = () => {
    if (sectionName === "Place") {
      return (
        <PlaceOptions {...commonProps}/>
      );
    } else if (sectionName === "Attributes") {
      return (
        <AttributeOptions {...commonProps}/>
      );
    }
  };

  return (
  <div className={`${css.dropdown}`}>
    <div className={`${css.sectionHeaderLine} ${css.dropdownHeader}`} title={sectionAltText}>
      <span className={css.sectionTitle}>{sectionName}</span>
      <div>{renderSummary()}</div>
      <span className={css.userSelection}></span>
      <span className={classnames(css.dropdownIndicator, {[css.up]: showItems})} onClick={handleClick}></span>
    </div>
    <div className={classnames(css.dropdownBody, {[css.hidden]: !showItems})}>
      <div className={css.options}>
        {renderOptions()}
      </div>
    </div>
  </div>
  );
};
