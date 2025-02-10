import React from "react";
import { TypeContext } from "../context/TypeContext";
import { DataContext } from "../context/DataProvider";

export const useCombinedContext = () => {
  const typeContext = React.useContext(TypeContext);
  const dataContext = React.useContext(DataContext);
  if (!typeContext || !dataContext) {
    throw new Error(
      "useCombinedContext must be used within a TypeProvider and DataProvider",
    );
  }
  return { ...typeContext, ...dataContext };
};
