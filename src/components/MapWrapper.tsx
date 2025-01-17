import { useEffect, useRef, useState } from "react"
import { OSM } from "ol/source";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { Map, View } from "ol";
import VectorSource from "ol/source/Vector";
import '../styles/MapWrapper.css';
import { GeometryType } from "./controls";
import { DrawInteractions } from "./interactions";
import { CoordinatesDisplay } from "../informations";
import { ICoordinates } from "../@types/type";

export const MapWrapper = () => {

  const [map, setMap] = useState<Map | null>(null);
  const [vectorLayer, setVectorLayer] = useState<VectorLayer | null>(null);
  const [geometryType, setGeometryType] = useState<string>('Point');
  const [coordinates, setCoordinates] = useState<ICoordinates>([]);

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

      return () => {
        setMap(null);
        initialMap.setTarget(null);
      }
    }
  }, [])

  useEffect(() => {
    console.log('heloo \n' + coordinates);
  }, [coordinates])


  return (
    <div>
      <div ref={mapElement} id="map"></div>
      <GeometryType setGeometryType={setGeometryType} />
      {map && vectorLayer && (
        <DrawInteractions map={map} vectorLayer={vectorLayer} geometryType={geometryType} setCoordinates={setCoordinates} />
      )}
      {coordinates.length > 0 && (
        <CoordinatesDisplay coordinates={coordinates} />
      )}
    </div>
  )
}

export default MapWrapper;