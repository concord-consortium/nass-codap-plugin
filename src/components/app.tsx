import React, {useEffect, useState} from "react";
import { Dropdown } from "./dropdown";
import classnames from "classnames";
import { Information } from "./information";
import { attributeOptions, categories, defaultSelectedOptions } from "./constants";
import { IStateOptions } from "./types";
import { createTableFromSelections } from "../scripts/api";
import { connect } from "../scripts/connect";


import css from "./app.scss";

function App() {
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = useState<IStateOptions>(defaultSelectedOptions);
  const [getDataDisabled, setGetDataDisabled] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      await connect.initialize();
    };
    init();
  }, []);

  useEffect(() => {
    const {geographicLevel, states, years} = selectedOptions;
    const attrKeys = attributeOptions.filter((attr) => attr.key !== "cropUnits").map((attr) => attr.key);
    const selectedAttrKeys = attrKeys.filter((key) => selectedOptions[key].length > 0);
    if (selectedAttrKeys.length && geographicLevel && states.length && years.length) {
      setGetDataDisabled(false);
    } else {
      setGetDataDisabled(true);
    }
  }, [selectedOptions]);

  const handleSetSelectedOptions = (option: string, value: string | string[]) => {
    const newSelectedOptions = {...selectedOptions, [option]: value};
    setSelectedOptions(newSelectedOptions);
  };

  const handleInfoClick = () => {
    setShowInfo(true);
  };

  const handleGetData = async () => {
    await createTableFromSelections(selectedOptions);
  };

  return (
    <div className={css.pluginContent}>
      { showInfo &&
      <Information closeInfo={() => setShowInfo(false)}/>
      }
      <div className={css.introSection}>
        <div className={css.sectionHeaderLine}>
        <span className={css.sectionHeaderText}>
          Retrieve data on U.S. agricultural statitistics at the state or county level.
        </span>
        <span
          title="Further information about this CODAP plugin"
          className={classnames(css.infoButton, {[css.disabled]: showInfo})}
          onClick={handleInfoClick}
        />
        </div>
      </div>
      <div className={css.scrollArea}>
        {categories.map((cat) => {
          return (
            <Dropdown
              key={cat.header}
              category={cat.header}
              sectionAltText={cat.altText}
              handleSetSelectedOptions={handleSetSelectedOptions}
              selectedOptions={selectedOptions}
            />
          );
        })}
      </div>
      <div className={css.summary}>
        <span className={css.statusGraphic}></span>
        <button className={css.getDataButton} disabled={getDataDisabled} onClick={handleGetData}>Get Data</button>
      </div>
    </div>

  );
}

export default App;
