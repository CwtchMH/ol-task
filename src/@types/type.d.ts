import React from "react";

export interface IType {
    type: string;
    setType: React.Dispatch<React.SetStateAction<string>>;
}

export type ICoordinates = [number, number] | [number, number][];


