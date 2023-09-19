import React, { useEffect, useState } from "react";
import { attributeOptions, yearsOptions } from "../constants/constants";
import { IStateOptions } from "../constants/types";
import { Options } from "./options";
import { queryData } from "../constants/query-headers";
import { flatten } from "../scripts/utils";

import css from "./options.scss";

interface IProps {
  handleSetSelectedOptions: (option: string, value: string|string[]) => void;
  selectedOptions: IStateOptions;
}

export const YearsOptions: React.FC<IProps> = (props) => {
  const {handleSetSelectedOptions, selectedOptions} = props;
  const [availableYearOptions, setAvailableYearOptions] = useState<string[]>([]);

  useEffect(() => {
    const attrKeys = attributeOptions.filter((attr) => attr.key !== "cropUnits").map((attr) => attr.key);
    const selectedAttrKeys = attrKeys.filter((key) => selectedOptions[key].length > 0);

    if (!selectedAttrKeys.length) {
      return;
    }

    const allSelectedAttrs = flatten(selectedAttrKeys.map((key) => selectedOptions[key]));
    const newAvailableYears = allSelectedAttrs.reduce((years, attr) => {
      const subAttrData = queryData.find((d) => d.plugInAttribute === attr);
      const availableYears = subAttrData?.years[selectedOptions.geographicLevel];
      if (availableYears) {
        availableYears.forEach((y) => {
          years.add(y);
        });
      }
      return years;
    }, new Set());
    const newSet: string[] = Array.from(newAvailableYears);
    setAvailableYearOptions(newSet);

    // if selected years includes years not in available options, remove them from selection
    const selectionsNotAvailable = selectedOptions.years.filter(year => !newSet.includes(year));
    if (selectionsNotAvailable.length) {
      const newSelectedYears = [...selectedOptions.years];
      selectionsNotAvailable.forEach((year) => {
        newSelectedYears.splice(newSelectedYears.indexOf(year), 1);
      });
      handleSetSelectedOptions("years", newSelectedYears);
    }

  }, [selectedOptions, handleSetSelectedOptions]);

  const handleSelectYear = (yearKey: string, years: string|string[]) => {
    handleSetSelectedOptions(yearKey, years);
  };

  return (
    <div className={css.checkOptions}>
      {availableYearOptions.length === 0 ?
      <div>Please select attributes to see available years.</div>
      :
      <Options
        options={availableYearOptions}
        optionKey={yearsOptions.key}
        inputType={"checkbox"}
        selectedOptions={selectedOptions}
        handleSetSelectedOptions={handleSelectYear}
      />}
    </div>
  );
};
