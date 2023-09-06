import React from "react";
import css from "./information.scss";

interface IProps {
  closeInfo: () => void;
}

export const Information: React.FC<IProps> = (props) => {
  const {closeInfo} = props;
  return (
  <>
    <div className={css.cover}></div>
    <div className={css.popUp}>
      <div className={css.popUpContent}>
        <div className={css.popUpBody}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ipsum velit, pellentesque eget turpis non, vestibulum egestas tellus. Fusce sed dolor hendrerit, rutrum ligula et, imperdiet est. Nam tincidunt leo a ultricies elementum. Quisque ornare eget massa ac congue. Curabitur et nisi orci. Nulla mollis lacus eu velit mollis, in vehicula lectus ultricies. Nulla facilisi.
        </div>
        <div className={css.popUpFooter}>
          <div className={css.controlRow}>
            <span><button className={css.button} onClick={closeInfo}>Close</button></span>
          </div>
        </div>
      </div>
    </div>
  </>
  );
};
