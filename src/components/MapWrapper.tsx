import { useEffect, useState } from "react";
import {
  DrawInteractions,
  SelectInteractions,
  TranslateInteractions,
} from "./interactions";
import { ModifyInteractions } from "./interactions";
import Feature from "ol/Feature";
import { useCombinedContext } from "../hooks/useCombinedContext";

export const MapWrapper = () => {
  const {
    enableDraw,
    enableSelect,
    enableTranslate,
    typeGeometry,
    map,
    vectorLayer,
    mapRef,
    typeInteraction,
    isSelected,
    setIsSelected,
  } = useCombinedContext();

  const [tempFeature, setTempFeature] = useState<Feature | null>(null);

  useEffect(() => {
    if (tempFeature) {
      console.log("tempFeature", tempFeature);
    }
  }, [tempFeature]);

  return (
    <div className="w-full">
      <div
        id="map"
        ref={mapRef}
        style={{ height: "100vh", width: "auto" }}
      ></div>
      {map && vectorLayer && enableDraw && (
        <DrawInteractions
          map={map}
          vectorLayer={vectorLayer}
          geometryType={typeGeometry}
        />
      )}
      {map && vectorLayer && enableSelect && !enableTranslate && (
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
          //setIsSelected={setIsSelected}
        />
      )}
    </div>
  );
};

export default MapWrapper;
