import * as React from "react";
import { IType } from "../@types/type";

export const TypeContext = React.createContext<IType | null>(null);

export const TypeProvider = ({ children }: { children: React.ReactNode }) => {
  const [enableModify, setEnableModify] = React.useState(false);
  const [enableDraw, setEnableDraw] = React.useState(false);
  const [enableSelect, setEnableSelect] = React.useState(false);

  return (
    <TypeContext.Provider
      value={{
        enableModify,
        setEnableModify,
        enableDraw,
        setEnableDraw,
        enableSelect,
        setEnableSelect,
      }}
    >
      {children}
    </TypeContext.Provider>
  );
};

export const useTypeContext = () => {
  const context = React.useContext(TypeContext);
  if (!context) {
    throw new Error("useTypeContext must be used within a TypeProvider");
  }
  return context;
};
