import { Map, View } from "ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { useRef, useState, useEffect, useContext } from "react";
import { Tile as TileLayer } from "ol/layer";
import { OSM } from "ol/source";
import { createContext } from "react";
import { styleOrigin } from "../libs/style";

interface MapContextType {
  map: Map | undefined;
  vectorSource: VectorSource;
  vectorLayer: VectorLayer;
  mapRef: React.RefObject<HTMLDivElement>;
}

const MapContext = createContext<MapContextType | null>(null);

export const MapProvider = ({ children }: { children: React.ReactNode }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<Map>();
  const [vectorSource] = useState(new VectorSource({ wrapX: false }));
  const [vectorLayer] = useState(
    new VectorLayer({
      source: vectorSource,
      style: styleOrigin,
    }),
  );
  const [rasterLayer] = useState<TileLayer>(
    new TileLayer({
      source: new OSM(),
    }),
  );

  useEffect(() => {
    const initialMap = new Map({
      layers: [rasterLayer, vectorLayer],
      target: mapRef.current || undefined,
      view: new View({
        center: [0, 0],
        zoom: 0,
      }),
    });

    setMap(initialMap);

    return () => {
      if (initialMap) {
        initialMap.setTarget(undefined);
      }
    };
  }, [rasterLayer, vectorLayer]);

  return (
    <MapContext.Provider value={{ map, vectorSource, vectorLayer, mapRef }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMapContext must be used within a MapProvider");
  }
  return context;
};
