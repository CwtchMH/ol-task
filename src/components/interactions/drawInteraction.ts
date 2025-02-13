import VectorLayer from "ol/layer/Vector";
import { Map } from "ol";
import { useEffect, useRef } from "react";
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
    console.log(drawRef.current);
    if (!value && drawRef.current !== null) {
      drawRef.current?.setActive(false);
    }
  };

  const { setDrawQuantity } = useCombinedContext();

  useEffect(() => {
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

    drawRef.current = draw;
    map?.addInteraction(draw);

    const listenerKeyStart = draw.on("drawstart", () => {
      console.log("Start drawing");
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

      console.log(sourceDraw.getFeatures().length);

      if (featureLast.getGeometry()?.getType() === "Point") {
        console.log("Point");
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
        console.log(source.getFeatures().length);
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

  return null;
};

export default DrawInteractions;
