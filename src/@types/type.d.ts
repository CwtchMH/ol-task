import React from "react";

export interface IType {
  enableModify: boolean;
  setEnableModify: React.Dispatch<React.SetStateAction<boolean>>;
  enableDraw: boolean;
  setEnableDraw: React.Dispatch<React.SetStateAction<boolean>>;
  enableSelect: boolean;
  setEnableSelect: React.Dispatch<React.SetStateAction<boolean>>;
}

export type ICoordinates = [number, number] | [number, number][];
