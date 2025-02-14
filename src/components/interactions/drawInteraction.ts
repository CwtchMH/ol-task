import VectorLayer from "ol/layer/Vector";
import { Map } from "ol";
import { useEffect, useRef, useState } from "react";
import VectorSource from "ol/source/Vector";
import { Type } from "ol/geom/Geometry";
import Draw from "ol/interaction/Draw";
import { styleDraw } from "../../libs/style";
import { useCombinedContext } from "../../hooks/useCombinedContext";

export const DrawInteractions = ({
  map,
  vectorLayer,
  geometryType,
}: {
  map: Map | null;
  vectorLayer: VectorLayer | null;
  geometryType: string;
}) => {
  const drawRef = useRef<Draw | null>(null);
  const isDrawingRef = useRef<boolean>(false);

  const updateIsDrawing = (value: boolean) => {
    isDrawingRef.current = value;
    if (!value && drawRef.current !== null) {
      drawRef.current?.setActive(false);
    }
  };

  const { setDrawQuantity, enableDraw } = useCombinedContext();

  const [sourceDraw] = useState(new VectorSource({ wrapX: false }));

  const [layerDraw] = useState(
    new VectorLayer({
      source: sourceDraw,
      style: styleDraw,
    }),
  );

  useEffect(() => {
    const source = vectorLayer?.getSource() as VectorSource;

    map?.addLayer(layerDraw);

    const draw = new Draw({
      source: sourceDraw,
      type: geometryType as Type,
    });

    drawRef.current = draw;
    map?.addInteraction(draw);

    const listenerKeyStart = draw.on("drawstart", () => {
      document.body.style.cursor = "crosshair";
    });

    const listenerKeyEnd = draw.on("drawend", () => {
      document.body.style.cursor = "default";
      setDrawQuantity((prev) => prev + 1);
    });

    const handleSingleClick = () => {
      if (!isDrawingRef.current) {
        draw.setActive(true);
        updateIsDrawing(true);
      }
    };

    const handleDblClick = () => {
      const featureLast =
        sourceDraw.getFeatures()[sourceDraw.getFeatures().length - 1];

      if (featureLast.getGeometry()?.getType() === "Point") {
        sourceDraw.removeFeature(featureLast);
        sourceDraw.removeFeature(
          sourceDraw.getFeatures()[sourceDraw.getFeatures().length - 1],
        );
      }

      if (sourceDraw.getFeatures().length) {
        source.addFeatures(sourceDraw.getFeatures());
        sourceDraw.clear();
        document.body.style.cursor = "default";
        alert("Done drawing a feature");
        updateIsDrawing(false);
      }
    };

    map?.on("dblclick", handleDblClick);
    map?.on("singleclick", handleSingleClick);

    return () => {
      if (!enableDraw) sourceDraw.clear();
      map?.removeLayer(layerDraw);
      map?.removeInteraction(draw);
      draw.un("drawstart", listenerKeyStart.listener);
      draw.un("drawend", listenerKeyEnd.listener);
      map?.un("dblclick", handleDblClick);
      map?.un("singleclick", handleSingleClick);
    };
  }, [geometryType]);

  return null;
};

export default DrawInteractions;
