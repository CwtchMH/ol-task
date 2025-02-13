import React from "react";
import { TypeContext } from "../context/TypeContext";
import { DataContext } from "../context/DataProvider";
import { useMapContext } from "../context/MapProvider";

export const useCombinedContext = () => {
  const typeContext = React.useContext(TypeContext);
  const dataContext = React.useContext(DataContext);
  const MapContext = useMapContext();
  if (!typeContext || !dataContext || !MapContext) {
    throw new Error(
      "useCombinedContext must be used within a TypeProvider and DataProvider",
    );
  }
  return { ...typeContext, ...dataContext, ...MapContext };
};
