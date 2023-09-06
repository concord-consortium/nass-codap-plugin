import React, { useState } from "react";
import classnames from "classnames";
import css from "./dropdown.scss";

interface IProps {
  sectionName: string
  sectionAltText: string
  sectionDescription: string
}

export const Dropdown: React.FC<IProps> = (props) => {
  const {sectionName, sectionAltText, sectionDescription} = props;
  const [showItems, setShowItems] = useState<boolean>(false);

  const handleClick = () => {
    setShowItems(!showItems);
  };

  return (
  <div className={`${css.dropdown}`}>
    <div className={`${css.sectionHeaderLine} ${css.dropdownHeader}`} title={sectionAltText}>
      <span className={css.sectionTitle}>{sectionName}</span>
      <span className={css.userSelection}></span>
      <span className={classnames(css.dropdownIndicator, {[css.up]: showItems})} onClick={handleClick}></span>
    </div>
    <div className={classnames(css.dropdownBody, {[css.hidden]: !showItems})}>
      <p>{sectionDescription}</p>
      <div className={css.selectionItems}>
      </div>
    </div>
  </div>
  );
};
