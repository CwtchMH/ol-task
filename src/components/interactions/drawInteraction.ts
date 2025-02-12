import VectorLayer from "ol/layer/Vector";
import { Feature, Map } from "ol";
import { useEffect, useRef, useState } from "react";
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

  const [isDrawing, setIsDrawing] = useState(true);
  const [draw, setDraw] = useState<Draw | null>(null);

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

    setDraw(draw);

    map?.addInteraction(draw);

    const listenerKeyStart = draw.on("drawstart", () => {
      document.body.style.cursor = "crosshair";
      console.log(sourceDraw.getFeatures().length);
      console.log(source.getFeatures().length);
    });

    const listenerKeyEnd = draw.on("drawend", (e) => {
      document.body.style.cursor = "default";
      featureRef.current = e.feature;
      if (!sourceDraw.hasFeature(e.feature)) {
        console.log("Adding feature to sourceDraw");
        sourceDraw.addFeature(e.feature.clone());
      }
      setDrawQuantity((prev) => prev + 1);
    });

    const handleSingleClick = () => {
      setIsDrawing(true);
    };

    const handleDblClick = drawDblClick({
      source,
      sourceDraw,
      setIsDrawing,
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
