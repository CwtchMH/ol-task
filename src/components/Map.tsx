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
import { selectedStyle, style } from "../libs/style";
import { useTypeContext } from "../context/TypeContext";
import Select from "ol/interaction/Select";
import { click } from "ol/events/condition";
import interactionDoubleClickZoom from "ol/interaction/DoubleClickZoom";

const MapComponent = ({ type }: { type: string }) => {
  const { setType } = useTypeContext();
  const mapRef = useRef<HTMLDivElement | null>(null); // Reference for the map container
  const mapInstance = useRef<Map | null>(null); // Reference to store the map instance
  const sourceRef = useRef<VectorSource | null>(null); // Reference to store the source instance
  const drawRef = useRef<Draw | null>(null); // Reference to store the draw instance
  const modifyRef = useRef<Modify | null>(null); // Reference to store the modify instance
  const snapRef = useRef<Snap | null>(null); // Reference to store the snap instance
  const selectInteractionRef = useRef<Select | null>(null);

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

      const highlightSource = new VectorSource({ wrapX: false });
      const highlightVector = new VectorLayer({
        source: highlightSource,
        style: selectedStyle,
      });

      sourceRef.current = source;

      mapInstance.current = new Map({
        target: mapRef.current,
        layers: [raster, vector, highlightVector],
        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
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

      const selectInteraction = new Select({
        condition: click,
        layers: [vector],
        multi: false,
      });

      selectInteractionRef.current = selectInteraction;

      mapInstance.current.addInteraction(selectInteraction);

      selectInteraction.on("select", (event) => {
        const selected = event.selected;
        const deselected = event.deselected;

        deselected.forEach((feature) => {
          highlightSource.removeFeature(feature);
        });

        selected.forEach((feature) => {
          highlightVector.getSource()?.addFeature(feature);

          mapInstance.current?.on("dblclick", (event) => {
            event.preventDefault();
            mapInstance.current?.getInteractions().forEach((interaction) => {
              if (interaction instanceof interactionDoubleClickZoom) {
                interaction.setActive(false);
              }
            });

            const clonedFeature = feature.clone();

            clonedFeature.setId(`clone-${feature.getId()}`);

            highlightVector.getSource()?.addFeature(clonedFeature);

            highlightSource.removeFeature(feature);

            modifyRef.current = new Modify({
              source: highlightSource,
            });

            mapInstance?.current.addInteraction(modifyRef.current);

            modifyRef.current.on("modifystart", () => {
              document.body.style.cursor = "pointer";
            });

            modifyRef.current.on("modifyend", () => {
              document.body.style.cursor = "default";
            });

            mapInstance.current.on("dblclick", (event) => {
              event.preventDefault();
              const modifiedFeature = highlightSource.getFeatureById(
                `clone-${feature.getId()}`
              );

              if (modifiedFeature) {
                highlightSource.removeFeature(modifiedFeature);
                source.removeFeature(feature);

                modifiedFeature.setStyle(style);

                source.addFeature(modifiedFeature);

              }
            });
          });
          // if (!isEditing) {
          //   console.log("Removing modify interaction");
          //   mapInstance.current?.getInteractions().forEach((interaction) => {
          //     if (interaction instanceof interactionDoubleClickZoom) {
          //       interaction.setActive(true);
          //     }
          //   });
          // }
        });
      });

      // snapRef.current = new Snap({ source: source });
      // mapInstance.current.addInteraction(snapRef.current);
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

        const highlightSource = new VectorSource({ wrapX: false });
        const highlightVector = new VectorLayer({
          source: highlightSource,
          style: selectedStyle,
        });

        const vector = new VectorLayer({
          source: sourceRef.current,
          style: style,
        });

        const selectInteraction = new Select({
          condition: click,
          layers: [vector],
          multi: false,
        });

        selectInteractionRef.current = selectInteraction;

        mapInstance.current.addInteraction(selectInteraction);

        selectInteraction.on("select", (event) => {
          const selected = event.selected;
          const deselected = event.deselected;

          deselected.forEach((feature) => {
            highlightSource.removeFeature(feature);
          });

          selected.forEach((feature) => {
            highlightVector.getSource()?.addFeature(feature);

            mapInstance.current?.on("dblclick", (event) => {
              event.preventDefault();
              mapInstance.current?.getInteractions().forEach((interaction) => {
                if (interaction instanceof interactionDoubleClickZoom) {
                  interaction.setActive(false);
                }
              });

              const clonedFeature = feature.clone();

              clonedFeature.setId(`clone-${feature.getId()}`);

              highlightVector.getSource()?.addFeature(clonedFeature);

              highlightSource.removeFeature(feature);

              modifyRef.current = new Modify({
                source: highlightSource,
              });

              mapInstance?.current.addInteraction(modifyRef.current);

              modifyRef.current.on("modifystart", () => {
                document.body.style.cursor = "pointer";
              });

              modifyRef.current.on("modifyend", () => {
                document.body.style.cursor = "default";
              });

              mapInstance.current.on("dblclick", (event) => {
                event.preventDefault();
                const modifiedFeature = highlightSource.getFeatureById(
                  `clone-${feature.getId()}`
                );

                if (modifiedFeature) {
                  highlightSource.removeFeature(modifiedFeature);
                  sourceRef.current.removeFeature(feature);

                  modifiedFeature.setStyle(style);

                  sourceRef.current.addFeature(modifiedFeature);
                }
              });
            });
            // if (!isEditing) {
            //   console.log("Removing modify interaction");
            //   mapInstance.current?.getInteractions().forEach((interaction) => {
            //     if (interaction instanceof interactionDoubleClickZoom) {
            //       interaction.setActive(true);
            //     }
            //   });
            // }
          });
        });
      }
    }
  }, [type]);

  return <div id="map" ref={mapRef} />;
};

export default MapComponent;
