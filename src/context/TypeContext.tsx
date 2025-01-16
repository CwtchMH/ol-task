import * as React from 'react';
import { IType } from '../@types/type';

export const TypeContext = React.createContext<IType | null>(null);

export const TypeProvider = ({ children } : { children: React.ReactNode}) => {

    const [type, setType] = React.useState("Polygon");

    return (
        <TypeContext.Provider value={{ type, setType }}>
            {children}
        </TypeContext.Provider>
    );
}

export const useTypeContext = () => {
    const context = React.useContext(TypeContext);
    if (!context) {
        throw new Error("useTypeContext must be used within a TypeProvider");
    }
    return context;
}
