import React from "react";
import { attributeOptions, yearsOptions } from "./constants";
import { IStateOptions } from "./types";
import { Options } from "./options";

import css from "./options.scss";
import { queryData } from "../scripts/query-headers";

interface IProps {
  handleSetSelectedOptions: (option: string, value: string|string[]) => void;
  selectedOptions: IStateOptions;
}

export const YearsOptions: React.FC<IProps> = (props) => {
  const {handleSetSelectedOptions, selectedOptions} = props;

  const handleSelectYear = (yearKey: string, years: string|string[]) => {
    handleSetSelectedOptions(yearKey, years);

    // check if any attributeOption keys have values in selectedOptions
    const attrKeys = attributeOptions.map((attr) => attr.key);
    const selectedAttrKeys = attrKeys.filter((key) => selectedOptions[key].length > 0);
    const areAnyAttrsSelected = selectedAttrKeys.length > 0;
    // if any attributes are selected, check that selected year data is available for that selected attribute
    if (areAnyAttrsSelected) {
      const selectedYears = Array.isArray(years) ? years : [years];
      const selectedAttrs = selectedAttrKeys.map((key) => selectedOptions[key]);
      selectedAttrs.forEach((attr) => {
        if (Array.isArray(attr)) {
          attr.forEach((subAttr) => {
            const subAttrData = queryData.find((d) => d.plugInAttribute === subAttr);
            const yearKeyToUse = selectedOptions.geographicLevel === "county" ? "county" : "state";
            const availableYears = subAttrData?.years[yearKeyToUse];
            if (availableYears) {
              // check -- are selectedYears included in queryParams?.years[yearKeyTouse] ?
              const areYearsValid = selectedYears.map((y) => availableYears.indexOf(y) > -1).indexOf(false) < 0;
              console.log({areYearsValid});
              console.log({availableYears});
              console.log({selectedYears});
              // do something if years are not valid
            }
          })
        }
      })
    }
  }

  return (
    <div className={css.checkOptions}>
      <Options
        options={yearsOptions.options}
        optionKey={yearsOptions.key}
        inputType={"checkbox"}
        selectedOptions={selectedOptions}
        handleSetSelectedOptions={handleSelectYear}
      />
    </div>
  );
};
