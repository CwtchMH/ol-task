import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { TypeProvider } from "./context/TypeContext.tsx";
import { DataProvider } from "./context/DataProvider.tsx";
import { MapProvider } from "./context/MapProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MapProvider>
      <TypeProvider>
        <DataProvider>
          <App />
        </DataProvider>
      </TypeProvider>
    </MapProvider>
  </StrictMode>,
);
