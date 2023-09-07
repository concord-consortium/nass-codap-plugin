import React, { useState } from "react";
import classnames from "classnames";
import css from "./dropdown.scss";
import { PlaceOptions } from "./place-options";
import { defaultSelectedOptions } from "./constants";

interface IProps {
  sectionName: string
  sectionAltText: string
  sectionDescription: string
  handleSetSelectedOptions: (option: string, value: string|string[]) => void
  selectedOptions: typeof defaultSelectedOptions;
}

export const Dropdown: React.FC<IProps> = (props) => {
  const {sectionName, sectionAltText, sectionDescription, handleSetSelectedOptions, selectedOptions} = props;
  const [showItems, setShowItems] = useState<boolean>(false);

  const handleClick = () => {
    setShowItems(!showItems);
  };

  const renderOptions = () => {
    if (sectionName === "Place") {
      return (
        <PlaceOptions
          handleSetSelectedOptions={handleSetSelectedOptions}
          selectedPlace={selectedOptions.place}
          selectedStates={selectedOptions.states}
        />
      );
    }
  };

  return (
  <div className={`${css.dropdown}`}>
    <div className={`${css.sectionHeaderLine} ${css.dropdownHeader}`} title={sectionAltText}>
      <span className={css.sectionTitle}>{sectionName}</span>
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
