import React, {useEffect, useState} from "react";
import { Dropdown } from "./dropdown";
import classnames from "classnames";
import { Information } from "./information";
import { Warning } from "./warning";
import { attributeOptions, categories, defaultSelectedOptions } from "../constants/constants";
import { IStateOptions } from "../constants/types";
import { createTableFromSelections, getNumberOfItems } from "../scripts/api";
import { connect } from "../scripts/connect";
import ProgressIndicator from "../assets/progress-indicator.svg";
import Checkmark from "../assets/done.svg";
import Error from "../assets/warning.svg";

import css from "./app.scss";

function App() {
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = useState<IStateOptions>(defaultSelectedOptions);
  const [getDataDisabled, setGetDataDisabled] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [statusGraphic, setStatusGraphic] = useState<React.ReactElement>();
  const [showWarning, setShowWarning] = useState<boolean>(false);

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

  const handleSetSelectedOptions = (newState: Partial<IStateOptions>) => {
    const newSelectedOptions = {...selectedOptions, ...newState};
    setSelectedOptions(newSelectedOptions);
  };

  const handleInfoClick = () => {
    setShowInfo(true);
  };

  const getData = async () => {
    setStatusMessage("Fetching data...");
    setStatusGraphic(<ProgressIndicator/>);
    const res = await createTableFromSelections(selectedOptions);
    if (res !== "success") {
      setStatusMessage("Fetch Error. Please retry.");
      setStatusGraphic(<Error/>);
    } else {
      setStatusMessage("Fetched data.");
      setStatusGraphic(<Checkmark/>);
    }
  };

  const handleGetData = async () => {
    const numberOfRows = getNumberOfItems(selectedOptions);
    if (numberOfRows > 4000) {
      setShowWarning(true);
    } else {
      await getData();
    }
  };

  const handleCloseWarning = async (getDataAnyway: boolean) => {
    setShowWarning(false);
    if (getDataAnyway) {
      await getData();
    }
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
        <div className={css.status}>
          <div>{statusGraphic}</div>
          <div>{statusMessage}</div>
        </div>
        <button className={css.getDataButton} disabled={getDataDisabled} onClick={handleGetData}>Get Data</button>
      </div>
      { showWarning &&
        <Warning handleCloseWarning={handleCloseWarning}/>
      }
    </div>

  );
}

export default App;
