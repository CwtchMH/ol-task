import { Feature } from "ol";
import React from "react";

export interface IType {
  enableModify: boolean;
  setEnableModify: React.Dispatch<React.SetStateAction<boolean>>;
  enableDraw: boolean;
  setEnableDraw: React.Dispatch<React.SetStateAction<boolean>>;
  enableSelect: boolean;
  setEnableSelect: React.Dispatch<React.SetStateAction<boolean>>;
  enableTranslate: boolean;
  setEnableTranslate: React.Dispatch<React.SetStateAction<boolean>>;
  typeGeometry: string;
  setTypeGeometry: React.Dispatch<React.SetStateAction<string>>;
  typeInteraction: string;
  setTypeInteraction: React.Dispatch<React.SetStateAction<string>>;
  isSelected: boolean;
  setIsSelected: React.Dispatch<React.SetStateAction<boolean>>;
  tempFeature: Feature | null;
  setTempFeature: React.Dispatch<React.SetStateAction<Feature | null>>;
}

export interface IData {
  featureQuantity: number;
  setFeatureQuantity: React.Dispatch<React.SetStateAction<number>>;
  modifyQuantity: number;
  setModifyQuantity: React.Dispatch<React.SetStateAction<number>>;
  drawQuantity: number;
  setDrawQuantity: React.Dispatch<React.SetStateAction<number>>;
  translateQuantity: number;
  setTranslateQuantity: React.Dispatch<React.SetStateAction<number>>;
}

export type ICoordinates = [number, number] | [number, number][];
