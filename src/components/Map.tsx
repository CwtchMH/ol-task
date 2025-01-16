import { useEffect, useRef } from "react";
import Draw from "ol/interaction/Draw";
import Modify from "ol/interaction/Modify";
import Snap from "ol/interaction/Snap";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { Vector as VectorSource } from "ol/source.js";
import { Vector as VectorLayer } from "ol/layer.js";
import { Type } from "ol/geom/Geometry";
import { SimpleGeometry } from "ol/geom";
import { style } from "../libs/style";
import { selectClick, selectDoubleClick } from "../libs/select";
import { useTypeContext } from "../context/TypeContext";

const MapComponent = ({ type }: { type: string }) => {
  const { setType } = useTypeContext();
  const mapRef = useRef<HTMLDivElement | null>(null); // Reference for the map container
  const mapInstance = useRef<Map | null>(null); // Reference to store the map instance
  const sourceRef = useRef<VectorSource | null>(null); // Reference to store the source instance
  const drawRef = useRef<Draw | null>(null); // Reference to store the draw instance
  const modifyRef = useRef<Modify | null>(null); // Reference to store the modify instance
  const snapRef = useRef<Snap | null>(null); // Reference to store the snap instance

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      const raster = new TileLayer({
        source: new OSM(),
      });

      const source = new VectorSource({ wrapX: false });

      const vector = new VectorLayer({
        source: source,
        style: style,
      });

      sourceRef.current = source;

      mapInstance.current = new Map({
        target: mapRef.current,
        layers: [raster, vector],
        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
      });

      mapInstance.current.addInteraction(selectClick);
      mapInstance.current.addInteraction(selectDoubleClick);

      modifyRef.current = new Modify({
        source: source,
      });

      mapInstance.current.addInteraction(modifyRef.current);

      // selectDoubleClick.on("select", () => {
      //   if (selectDoubleClick.getFeatures().getLength() > 0) {
      //     document.body.style.cursor = "move"; // Đổi con trỏ khi có feature được chọn
      //   } else {
      //     document.body.style.cursor = "default";
      //   }
      // });

      modifyRef.current.on("modifystart", () => {
        if (mapInstance.current) {
          mapInstance.current.removeInteraction(selectClick);
          mapInstance.current.removeInteraction(selectDoubleClick);
        }
        document.body.style.cursor = "move";
      });

      modifyRef.current.on("modifyend", () => {
        if (mapInstance.current) {
          mapInstance.current.addInteraction(selectClick);
          mapInstance.current.addInteraction(selectDoubleClick);
        }
        document.body.style.cursor = "default";
      });

      const draw = new Draw({
        source: source,
        type: type as Type,
      });

      draw.on("drawend", (event) => {
        const feature = event.feature;
        const geometry = feature.getGeometry() as SimpleGeometry;
        const coordinates = geometry?.getCoordinates();
        console.log(coordinates);
        console.log(feature);
        setType("None");
      });

      drawRef.current = draw;

      mapInstance.current.addInteraction(draw);
      snapRef.current = new Snap({ source: source });
      mapInstance.current.addInteraction(snapRef.current);
    }

    if (mapInstance.current && sourceRef.current) {
      mapInstance.current.removeInteraction(drawRef.current as Draw);
      mapInstance.current.removeInteraction(snapRef.current as Snap);

      if (type !== "None") {
        const draw = new Draw({
          source: sourceRef.current,
          type: type as Type,
        });

        draw.on("drawend", (event) => {
          const feature = event.feature;
          const geometry = feature.getGeometry() as SimpleGeometry;
          const coordinates = geometry?.getCoordinates();
          console.log(coordinates);
          console.log(feature);
          setType("None");
        });

        drawRef.current = draw;

        mapInstance.current.addInteraction(draw);
        snapRef.current = new Snap({
          source: sourceRef.current,
        });
        mapInstance.current.addInteraction(snapRef.current);
      }
    }
  }, [type]);

  return <div id="map" ref={mapRef} />;
};

export default MapComponent;
