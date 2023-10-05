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
import { flatten } from "../scripts/utils";
import { queryData } from "../constants/queryHeaders";
import { strings } from "../constants/strings";

import css from "./app.scss";

function App() {
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = useState<IStateOptions>(defaultSelectedOptions);
  const [getDataDisabled, setGetDataDisabled] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [statusGraphic, setStatusGraphic] = useState<React.ReactElement>();
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string>("");

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
    setStatusMessage(strings.fetchingMsg);
    setStatusGraphic(<ProgressIndicator/>);
    const res = await createTableFromSelections(selectedOptions);
    if (res !== "success") {
      setStatusMessage(strings.fetchSuccess);
      setStatusGraphic(<Error/>);
    } else {
      setStatusMessage(strings.fetchError);
      setStatusGraphic(<Checkmark/>);
    }
  };

  const handleGetData = async () => {
    const numberOfRows = getNumberOfItems(selectedOptions);

    const attrKeys = attributeOptions.filter((attr) => attr.key !== "cropUnits").map((attr) => attr.key);
    const selectedAttrKeys = attrKeys.filter((key) => selectedOptions[key].length > 0);
    const allSelectedAttrs = flatten(selectedAttrKeys.map((key) => selectedOptions[key]));
    const selectedYears = selectedOptions.years;

    allSelectedAttrs.map((attr) => {
      const attrInfo = queryData.find((q) => q.plugInAttribute === attr);
      if (attrInfo) {
        const availableYears = attrInfo.years[selectedOptions.geographicLevel];
        for (let i = 0; i < selectedYears.length; i ++) {
          const y = selectedYears[i];
          if (!availableYears.includes(y)) {
            setWarningMessage(strings.yearsWarning);
            setShowWarning(true);
            return;
          }
        }
      }
    });

    if (numberOfRows > 4000) {
      setWarningMessage(strings.rowsWarning);
      setShowWarning(true);
    } else {
      await getData();
    }
  };

  const handleCloseWarning = async (getDataAnyway: boolean) => {
    setWarningMessage("");
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
          {strings.appDescription}
        </span>
        <span
          title={strings.infoTitle}
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
        <button className={css.getDataButton} disabled={getDataDisabled} onClick={handleGetData}>
          {strings.getData}
        </button>
      </div>
      { showWarning &&
        <Warning
          handleCloseWarning={handleCloseWarning}
          message={warningMessage}
        />
      }
    </div>

  );
}

export default App;
