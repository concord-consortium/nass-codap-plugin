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
  const [warningMessage, setWarningMessage] = useState<JSX.Element>(<p/>);
  const [reqCount, setReqCount] = useState({total: 0, completed: 0});
  const {farmDemographics, farmerDemographics, crops} = selectedOptions;

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

  useEffect(() => {
    if (!farmDemographics.length && !farmerDemographics.length && !crops.length) {
      setSelectedOptions(prevOptions => {
        return {...prevOptions, years: []};
      });
    }
  }, [farmerDemographics, farmDemographics, crops]);

  useEffect(() => {
    const {total, completed} = reqCount;
    if (total === 0) {
      setStatusMessage("");
      setStatusGraphic(<div/>);
    } else if (total > 0 && total !== completed) {
      setStatusMessage(`${completed} of ${total} requests complete`);
      setStatusGraphic(<ProgressIndicator/>);
    }
  }, [reqCount]);

  const handleSetSelectedOptions = (newState: Partial<IStateOptions>) => {
    const newSelectedOptions = {...selectedOptions, ...newState};
    setSelectedOptions(newSelectedOptions);
  };

  const handleInfoClick = () => {
    setShowInfo(true);
  };

  const getData = async () => {
    setReqCount({total: 0, completed: 0});
    const res = await createTableFromSelections(selectedOptions, setReqCount);
    if (res !== "success") {
      setStatusMessage(strings.fetchError);
      setStatusGraphic(<Error/>);
      setReqCount({total: 0, completed: 0});
    } else {
      setStatusMessage(strings.fetchSuccess);
      setStatusGraphic(<Checkmark/>);
      setReqCount({total: 0, completed: 0});
    }
  };

  const handleGetData = async () => {
    const numberOfRows = getNumberOfItems(selectedOptions);
    const attrKeys = attributeOptions.filter((attr) => attr.key !== "cropUnits").map((attr) => attr.key);
    const selectedAttrKeys = attrKeys.filter((key) => selectedOptions[key].length > 0);
    const allSelectedAttrs = flatten(selectedAttrKeys.map((key) => selectedOptions[key]));
    const selectedYears = selectedOptions.years;
    let showYearsWarning = false;

    allSelectedAttrs.forEach((attr) => {
      const attrInfo = queryData.find((q) => q.plugInAttribute === attr);
      if (attrInfo) {
        const availableYears = attrInfo.years[selectedOptions.geographicLevel];
        for (let i = 0; i < selectedYears.length; i ++) {
          const y = selectedYears[i];
          if (!availableYears.includes(y)) {
            showYearsWarning = true;
            break;
          }
        }
      }
    });

    if (showYearsWarning || numberOfRows > 4000) {
      const warningMsg = showYearsWarning && numberOfRows > 4000 ?
        <div>
          <p>{strings.rowsWarning}</p>
          <p>{strings.yearsWarning}</p>
        </div> : showYearsWarning ? <p>{strings.yearsWarning}</p> :
        <p>{strings.rowsWarning}</p>;
      setWarningMessage(warningMsg);
      setShowWarning(true);
    } else {
      await getData();
    }
  };

  const handleCloseWarning = async (getDataAnyway: boolean) => {
    setWarningMessage(<p/>);
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
