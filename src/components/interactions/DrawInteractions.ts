import VectorLayer from "ol/layer/Vector";
import { Feature, Map, MapBrowserEvent } from "ol";
import { useEffect, useRef, useState } from "react";
import VectorSource from "ol/source/Vector";
import { Type } from "ol/geom/Geometry";
import Draw from "ol/interaction/Draw";
import { ICoordinates } from "../../@types/type";
import { styleDraw } from "../../libs/style";
import { SimpleGeometry } from "ol/geom";

const DrawInteractions = ({
  map,
  vectorLayer,
  geometryType,
  setCoordinates,
}: {
  map: Map | null;
  vectorLayer: VectorLayer | null;
  geometryType: string;
  setCoordinates: (coordinates: ICoordinates) => void;
}) => {
  const featureRef = useRef<Feature | null>(null);

  const [isDrawing, setIsDrawing] = useState(true);
  const [draw, setDraw] = useState<Draw | null>(null);

  useEffect(() => {
    // if (geometryType === "None") return;
    const source = vectorLayer?.getSource() as VectorSource;

    const sourceDraw = new VectorSource({ wrapX: false });

    const layerDraw = new VectorLayer({
      source: sourceDraw,
      style: styleDraw,
    });

    map?.addLayer(layerDraw);

    const draw = new Draw({
      source: sourceDraw,
      type: geometryType as Type,
    });

    setDraw(draw);

    map?.addInteraction(draw);

    const listenerKeyStart = draw.on("drawstart", () => {
      document.body.style.cursor = "crosshair";
    });

    const listenerKeyEnd = draw.on("drawend", (e) => {
      document.body.style.cursor = "default";
      featureRef.current = e.feature;
      const feature = e.feature;
      if (feature instanceof SimpleGeometry) {
        setCoordinates(feature.getCoordinates() as ICoordinates);
      }
    });

    const handleSingleClick = () => {
      setIsDrawing(true);
    };

    const handleDblClick = (e: MapBrowserEvent<UIEvent>) => {
      const featureAtDblClick = e.coordinate;

      sourceDraw.clear();

      console.log(
        featureRef.current
          ?.getGeometry()
          ?.intersectsCoordinate(featureAtDblClick),
      );

      if (
        featureRef.current
          ?.getGeometry()
          ?.intersectsCoordinate(featureAtDblClick)
      ) {
        if (
          !source.hasFeature(featureRef.current) &&
          featureRef.current !== null
        ) {
          const feature = featureRef.current;
          source.addFeature(feature.clone());
          featureRef.current = null;
          sourceDraw.clear();
          document.body.style.cursor = "default";
          console.log(source.getFeatures().length);
          alert("Done drawing a feature");
          setIsDrawing(false);
        }
      }
    };

    map?.on("dblclick", handleDblClick);
    map?.on("singleclick", handleSingleClick);

    return () => {
      sourceDraw.clear();
      map?.removeLayer(layerDraw);
      map?.removeInteraction(draw);
      draw.un("drawstart", listenerKeyStart.listener);
      draw.un("drawend", listenerKeyEnd.listener);
      map?.un("dblclick", handleDblClick);
      map?.un("singleclick", handleSingleClick);
    };
  }, [map, vectorLayer, geometryType]);

  useEffect(() => {
    if (isDrawing) {
      console.log("Drawing");
      draw?.setActive(true);
    } else {
      console.log("Not drawing");
      draw?.setActive(false);
    }
  }, [isDrawing]);

  return null;
};

export default DrawInteractions;
