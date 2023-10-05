import React from "react";
import { IStateOptions } from "../constants/types";
import { attributeOptions } from "../constants/constants";
import { flatten } from "../scripts/utils";

interface IProps {
  category: string;
  selectedOptions: IStateOptions;
}

export const Summary: React.FC<IProps> = ({category, selectedOptions}) => {

  const getSummaryText = () => {
    if (category === "Place") {
      const place = selectedOptions.geographicLevel || "";
      const states = selectedOptions.states.join(`, `);
      const colon = place && states ? ": " : "";
      return (
        `${place}${colon}${states}`
      );
    } else if (category === "Attributes") {
        const result = flatten(attributeOptions.filter((opt) => selectedOptions[opt.key]).map((opt) => selectedOptions[opt.key]));
        return result.join(", ");
    } else if (category === "Years") {
      return selectedOptions.years.join(", ");
    }
  };

  return (
    <div>
      {getSummaryText()}
    </div>
  );
};
