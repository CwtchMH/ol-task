import VectorLayer from "ol/layer/Vector";
import { Feature, Map } from "ol";
import { useEffect, useRef } from "react";
import VectorSource from "ol/source/Vector";
import { Type } from "ol/geom/Geometry";
import Draw from "ol/interaction/Draw";
import { styleDraw } from "../../libs/style";
import { useCombinedContext } from "../../hooks/useCombinedContext";
import { drawDblClick } from "../../utils/drawDblClick";

export const DrawInteractions = ({
  map,
  vectorLayer,
  geometryType,
}: {
  map: Map | null;
  vectorLayer: VectorLayer | null;
  geometryType: string;
}) => {
  const featureRef = useRef<Feature | null>(null);

  const isDrawingRef = useRef<boolean>(false);

  const updateIsDrawing = (value: boolean) => {
    isDrawingRef.current = value;
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

    map?.addInteraction(draw);

    const listenerKeyStart = draw.on("drawstart", () => {
      console.log("Start drawing");
      document.body.style.cursor = "crosshair";
    });

    const listenerKeyEnd = draw.on("drawend", (e) => {
      document.body.style.cursor = "default";
      featureRef.current = e.feature;
      setDrawQuantity((prev) => prev + 1);
      draw.setActive(false);
    });

    const handleSingleClick = () => {
      console.log("single click");
      if (!isDrawingRef.current) {
        console.log("drawing ne");
        draw.setActive(true);
        updateIsDrawing(true);
      }
    };

    const handleDblClick = drawDblClick({
      source,
      sourceDraw,
      setIsDrawing: updateIsDrawing,
    });

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
