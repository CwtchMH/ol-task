import { useEffect, useRef, useState } from "react";
import { OSM } from "ol/source";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { Map, View } from "ol";
import VectorSource from "ol/source/Vector";
import {
  DrawInteractions,
  SelectInteractions,
  TranslateInteractions,
} from "./interactions";
import { ModifyInteractions } from "./interactions";
import Feature from "ol/Feature";
import { styleOrigin } from "../libs/style";
import { useCombinedContext } from "../hooks/useCombinedContext";

export const MapWrapper = () => {
  const { enableDraw, enableSelect, enableTranslate, typeGeometry } =
    useCombinedContext();

  const [map, setMap] = useState<Map | null>(null);
  const [vectorLayer, setVectorLayer] = useState<VectorLayer | null>(null);
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [tempFeature, setTempFeature] = useState<Feature | null>(null);

  const mapElement = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  mapRef.current = map;

  useEffect(() => {
    if (mapElement.current) {
      const raster = new TileLayer({
        source: new OSM(),
      });

      const source = new VectorSource({ wrapX: false });

      const vector = new VectorLayer({
        source: source,
        style: styleOrigin,
      });

      const initialMap = new Map({
        layers: [raster, vector],
        target: mapElement.current,
        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
      });

      setMap(initialMap);
      setVectorLayer(vector);

      return () => {
        setMap(null);
        initialMap.setTarget("null");
      };
    }
  }, []);

  useEffect(() => {
    if (tempFeature) {
      console.log("tempFeature", tempFeature);
    }
  }, [tempFeature]);

  return (
    <div className="w-full">
      <div ref={mapElement} id="map" className="h-[100vh] w-auto"></div>
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
          setIsSelected={setIsSelected}
          setTempFeature={setTempFeature}
        />
      )}
      {map && vectorLayer && isSelected && (
        <ModifyInteractions
          map={map}
          tempFeature={tempFeature}
          vectorLayer={vectorLayer}
        />
      )}
      {map && vectorLayer && enableTranslate && (
        <TranslateInteractions map={map} vectorLayer={vectorLayer} />
      )}
    </div>
  );
};

export default MapWrapper;
