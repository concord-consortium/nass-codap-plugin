import React from "react";
import WarningIcon from "../assets/warning.svg";
import css from "./warning.scss";

interface IProps {
  handleCloseWarning: (getDataAnyway: boolean) => void
}

export const Warning: React.FC<IProps> = (props) => {
  const {handleCloseWarning} = props;
  return (
    <div className={css.popUp}>
      <div className={css.popUpContent}>
        <div className={css.header}>
          Warning
        </div>
        <div className={css.popUpBody}>
          <div className={css.text}>
          The number of attributes you have selected is over 4000 rows and may lead to the program running slowly.
          </div>
        </div>
        <div className={css.popUpFooter}>
          <div className={css.controlRow}>
            <span><button className={css.button} onClick={() => handleCloseWarning(false)}>Change Attribute Selection</button></span>
            <span><button className={css.button} onClick={() => handleCloseWarning(true)}>Get Data Anyway</button></span>
          </div>
        </div>
      </div>
    </div>
  );
};
