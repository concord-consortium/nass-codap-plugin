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
          <p>
            <span style={{fontWeight: "bold"}}>Source:</span> This data comes from the National Agricultural Statistics Service (NASS) supplied
            by the U.S. Department of Agriculture. The NASS conducts hundreds of surveys every year, curates
            and makes public the data collected, and prepares reports covering virtually every aspect of U.S.
            agriculture. The data collected includes production and supplies of food, farm labor and wages,
            and changes in the demographics of U.S. producers.
          </p>
          <p><a href="https://www.nass.usda.gov/About_NASS/index.php" target="_blank" rel="noopener noreferrer">Learn more about the NASS</a></p>
          <p><a href="https://quickstats.nass.usda.gov/" target="_blank" rel="noopener noreferrer">Access the full NASS dataset</a></p>
          <p><a href="https://www.nass.usda.gov/Publications/index.php" target="_blank" rel="noopener noreferrer">Read reports published by NASS</a></p>
          <p>
            <span style={{fontWeight: "bold"}}>Acknowledgements:</span> Brought to you by the DataPBL project, a collaboration between
            Concord Consortium, EL Education, and the University of Colorado. This material is supported
            by the National Science Foundation under Grant No. DRL-2200887. Any opinions, findings, and
            conclusions or recommendations expressed in this material are those of the authors and
            do not necessarily reflect the views of the NSF.
          </p>
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
