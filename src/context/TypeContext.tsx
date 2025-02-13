import * as React from "react";
import { IType } from "../@types/type";

export const TypeContext = React.createContext<IType | null>(null);

export const TypeProvider = ({ children }: { children: React.ReactNode }) => {
  const [enableModify, setEnableModify] = React.useState(false);
  const [enableDraw, setEnableDraw] = React.useState(false);
  const [enableSelect, setEnableSelect] = React.useState(false);
  const [enableTranslate, setEnableTranslate] = React.useState(false);
  const [typeGeometry, setTypeGeometry] = React.useState<string>("Polygon");
  const [typeInteraction, setTypeInteraction] = React.useState<string>("");
  const [isSelected, setIsSelected] = React.useState<boolean>(false);

  return (
    <TypeContext.Provider
      value={{
        enableModify,
        setEnableModify,
        enableDraw,
        setEnableDraw,
        enableSelect,
        setEnableSelect,
        enableTranslate,
        setEnableTranslate,
        typeGeometry,
        setTypeGeometry,
        typeInteraction,
        setTypeInteraction,
        isSelected,
        setIsSelected,
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
