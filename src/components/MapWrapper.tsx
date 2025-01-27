import { useEffect, useRef, useState } from "react";
import { OSM } from "ol/source";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { Map, View } from "ol";
import VectorSource from "ol/source/Vector";
import "../styles/MapWrapper.css";
import { GeometryType } from "./controls";
import { DrawInteractions, ModifyInteractions, SelectInteractions } from "./interactions";
import { CoordinatesDisplay } from "../informations";
import { ICoordinates } from "../@types/type";
import { useTypeContext } from "../context/TypeContext";
import { set } from "ol/transform";

export const MapWrapper = () => {
  const { enableModify, setEnableModify, enableDraw, setEnableDraw, enableSelect, setEnableSelect } = useTypeContext();

  const [map, setMap] = useState<Map | null>(null);
  const [vectorLayer, setVectorLayer] = useState<VectorLayer | null>(null);
  const [geometryType, setGeometryType] = useState<string>("Point");
  const [coordinates, setCoordinates] = useState<ICoordinates>([]);
  const [raster, setRaster] = useState<TileLayer | null>(null);

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
      setRaster(raster);

      return () => {
        setMap(null);
        initialMap.setTarget(null);
      };
    }
  }, []);

  return (
    <div>
      <div ref={mapElement} id="map"></div>
      <GeometryType setGeometryType={setGeometryType} />
      {map && vectorLayer && enableDraw && (
        <DrawInteractions
          map={map}
          vectorLayer={vectorLayer}
          geometryType={geometryType}
          setCoordinates={setCoordinates}
        />
      )}
      {geometryType !== "Circle" &&
        coordinates !== null &&
        coordinates.length > 0 && (
          <CoordinatesDisplay coordinates={coordinates} />
        )}
      {map && vectorLayer && enableModify && (
        <ModifyInteractions
          map={map}
          vectorLayer={vectorLayer}
          setCoordinates={setCoordinates}
        />
      )}
      {map && vectorLayer && enableSelect && (
        <SelectInteractions
          map={map}
          vectorLayer={vectorLayer}
          raster={raster}
          setCoordinates={setCoordinates}
        />
      )}
    </div>
  );
};

export default MapWrapper;
