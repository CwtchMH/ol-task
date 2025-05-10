import React from "react";
import { IData } from "../@types/type";

export const DataContext = React.createContext<IData | null>(null);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [featureQuantity, setFeatureQuantity] = React.useState(0);
  const [modifyQuantity, setModifyQuantity] = React.useState(0);
  const [drawQuantity, setDrawQuantity] = React.useState(0);
  const [translateQuantity, setTranslateQuantity] = React.useState(0);

  return (
    <DataContext.Provider
      value={{
        featureQuantity,
        setFeatureQuantity,
        modifyQuantity,
        setModifyQuantity,
        drawQuantity,
        setDrawQuantity,
        translateQuantity,
        setTranslateQuantity,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = React.useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};
