import VectorLayer from "ol/layer/Vector";
import { Map } from "ol";
import { useEffect } from "react";
import VectorSource from "ol/source/Vector";
import { Type } from "ol/geom/Geometry";
import Draw from "ol/interaction/Draw";
import { ICoordinates } from "../../@types/type";
import { style } from "../../libs/style";

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
  useEffect(() => {
    if (geometryType === "None") return;

    const source = vectorLayer?.getSource() as VectorSource;

    const draw = new Draw({
      source: source,
      type: geometryType as Type,
    });

    map?.addInteraction(draw);

    const listenerKey = draw.on("drawend", (e) => {
        e.feature.setStyle(style)
        setCoordinates(e.feature.getGeometry()?.getCoordinates());
    })

    return () => {
        
        map?.removeInteraction(draw);
        draw.un("drawend", listenerKey.listener);
    }
  }, [map, vectorLayer, geometryType]);

  return null;
};

export default DrawInteractions;
