import React, { useEffect, useRef } from "react";
import Draw from "ol/interaction/Draw";
import { GeometryType } from "ol/render/webgl/MixedGeometryBatch";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { Vector as VectorSource } from "ol/source.js";
import { Vector as VectorLayer } from "ol/layer.js";

const MapComponent = ({type} : {type: GeometryType}) => {
  const mapRef = useRef<HTMLDivElement | null>(null); // Reference for the map container
  const mapInstance = useRef<Map | null>(null); // Reference to store the map instance

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      const raster = new TileLayer({
        source: new OSM(),
      });

      const source = new VectorSource({ wrapX: false });

      const vector = new VectorLayer({
        source: source,
      });

      // Initialize the map only once
      mapInstance.current = new Map({
        target: mapRef.current,
        layers: [raster, vector],
        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
      });

      const draw = new Draw({
        source: source,
        type: type,
      });

      draw.on("drawend", (event) => {
        const feature = event.feature; // The drawn feature
        const geometry = feature.getGeometry(); // The geometry of the feature
        const coordinates = geometry?.getCoordinates(); // Get the coordinates
        console.log(coordinates) // Get the coordinates
      });

      mapInstance.current.addInteraction(draw);
    }
    
  }, [type]);
  return <div id="map" ref={mapRef} />;
};

export default MapComponent;
