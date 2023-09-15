import React from "react";
import { IStateOptions } from "./types";
import { attributeOptions } from "./constants";

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
        const resultString = attributeOptions.filter((attr) => {
          const value = selectedOptions[attr.key];
          const valueIsArrayWithLength = Array.isArray(value) && value.length > 0;
          const valueIsDefined = typeof value === "string" && value;
          return valueIsArrayWithLength || valueIsDefined;
        }).map((attr) => {
          const value = selectedOptions[attr.key];
          const valueIsArrayWithLength = Array.isArray(value) && value.length > 0;
          const valueIsDefined = typeof value === "string" && value;
          const label = attr.label && (valueIsArrayWithLength || valueIsDefined) ? `${attr.label}: ` : "";

          if (Array.isArray(value) && value.length > 0) {
            return `${label}${value.join(", ")}`;
          } else if (value) {
            return `${attr.label}: ${value}`;
          } else {
            return null;
          }
        })
        .filter((item) => item !== null);
        const finalString = resultString.join(", ");
        return finalString;
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
