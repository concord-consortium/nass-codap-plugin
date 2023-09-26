import React, { useState } from "react";
import classnames from "classnames";
import { PlaceOptions } from "./place-options";
import { defaultSelectedOptions } from "../constants/constants";
import { AttributeOptions } from "./attribute-options";
import { YearsOptions } from "./years-options";
import { Summary } from "./summary";

import css from "./dropdown.scss";
import { IStateOptions } from "../constants/types";

interface IProps {
  category: string
  sectionAltText: string
  handleSetSelectedOptions: (newState: Partial<IStateOptions>) => void
  selectedOptions: typeof defaultSelectedOptions;
}

export const Dropdown: React.FC<IProps> = (props) => {
  const {category, sectionAltText, handleSetSelectedOptions, selectedOptions} = props;
  const [showItems, setShowItems] = useState<boolean>(false);

  const handleClick = () => {
    setShowItems(!showItems);
  };

  const commonProps = {handleSetSelectedOptions, selectedOptions};

  const renderOptions = () => {
    return category === "Place" ? <PlaceOptions {...commonProps}/> :
    category === "Attributes" ? <AttributeOptions {...commonProps}/> :
    <YearsOptions {...commonProps}/>;
  };

  return (
  <div className={`${css.dropdown}`}>
    <div className={`${css.sectionHeaderLine} ${css.dropdownHeader}`} title={sectionAltText}>
      <span className={css.sectionTitle}>{category}</span>
      <Summary category={category} selectedOptions={selectedOptions}/>
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
