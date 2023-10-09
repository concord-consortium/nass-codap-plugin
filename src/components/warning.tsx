import React from "react";
import css from "./warning.scss";

interface IProps {
  handleCloseWarning: (getDataAnyway: boolean) => void;
  message: JSX.Element;
}

export const Warning: React.FC<IProps> = (props) => {
  const {handleCloseWarning, message} = props;
  return (
    <div className={css.popUp}>
      <div className={css.popUpContent}>
        <div className={css.header}>
          Warning
        </div>
        <div className={css.popUpBody}>
          <div className={css.text}>
            {message}
          </div>
        </div>
        <div className={css.popUpFooter}>
          <div className={css.controlRow}>
            <span>
              <button className={css.button} onClick={() => handleCloseWarning(false)}>
                Change Attribute Selection
              </button>
            </span>
            <span>
              <button className={css.button} onClick={() => handleCloseWarning(true)}>
                Get Data Anyway
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
