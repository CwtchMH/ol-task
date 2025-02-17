import React from "react";
import {
  DrawInteractions,
  SelectInteractions,
  TranslateInteractions,
} from "./interactions";
import { ModifyInteractions } from "./interactions";
import { Map } from "ol";
import VectorLayer from "ol/layer/Vector";
import Feature from "ol/Feature";

export const MapWrapper = ({
  enableDraw,
  enableSelect,
  typeGeometry,
  map,
  vectorLayer,
  mapRef,
  typeInteraction,
  isSelected,
  setIsSelected,
  tempFeature,
  setTempFeature,
}: {
  enableDraw: boolean;
  enableSelect: boolean;
  typeGeometry: string;
  map: Map;
  vectorLayer: VectorLayer;
  mapRef: React.RefObject<HTMLDivElement>;
  typeInteraction: string;
  isSelected: boolean;
  setIsSelected: (isSelected: boolean) => void;
  tempFeature: Feature | null;
  setTempFeature: (feature: Feature | null) => void;
}) => {
  // useEffect(() => {
  //   if (tempFeature) {
  //     console.log("tempFeature", tempFeature);
  //   }
  // }, [tempFeature]);

  return (
    <div className="w-full">
      <div
        data-testid="map"
        id="map"
        ref={mapRef}
        style={{ height: "100vh", width: "auto" }}
      ></div>
      {map && vectorLayer && enableDraw && (
        <DrawInteractions
          map={map}
          vectorLayer={vectorLayer}
          geometryType={typeGeometry}
          enableDraw={enableDraw}
        />
      )}
      {map && vectorLayer && enableSelect && (
        <SelectInteractions
          map={map}
          vectorLayer={vectorLayer}
          setTempFeature={setTempFeature}
        />
      )}
      {map && vectorLayer && isSelected && typeInteraction === "Modify" && (
        <ModifyInteractions
          map={map}
          tempFeature={tempFeature}
          vectorLayer={vectorLayer}
          setIsSelected={setIsSelected}
        />
      )}
      {map && vectorLayer && isSelected && typeInteraction === "Translate" && (
        <TranslateInteractions
          map={map}
          vectorLayer={vectorLayer}
          tempFeature={tempFeature}
          setIsSelected={setIsSelected}
        />
      )}
    </div>
  );
};

export default MapWrapper;
