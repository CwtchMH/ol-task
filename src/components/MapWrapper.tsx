import { useEffect, useRef, useState } from "react"
import { OSM } from "ol/source";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { Map, View } from "ol";
import VectorSource from "ol/source/Vector";

export const MapWrapper = () => {

  const [map, setMap] = useState<Map | null>(null);
  const [vectorLayer, setVectorLayer] = useState<VectorLayer | null>(null);

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
  return (
    <div>
      <div ref={mapElement} id="map"></div>
      <div className="" id='control'>
        <div className="" id="select-type">
          <label htmlFor="type">Geometry type &nbsp;</label>
          <select value='' id="type">
            <option value="Point">Point</option>
            <option value="LineString">LineString</option>
            <option value="Polygon">Polygon</option>
            <option value="Circle">Circle</option>
            <option value="None">None</option>
          </select>
        </div>
        <div className="" id ="coordinates"></div>
      </div>
    </div>
  )
}

export default MapWrapper;