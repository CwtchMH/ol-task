import { useEffect } from "react";
import Modify from "ol/interaction/Modify";
import { Map } from "ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { useTypeContext } from "../../context/TypeContext";
import { ICoordinates } from "../../@types/type";

const ModifyInteractions = ({
  map,
  vectorLayer,
  setCoordinates
}: {
  map: Map | null;
  vectorLayer: VectorLayer | null;
  setCoordinates: (coordinates: ICoordinates) => void;
}) => {
  const { enableDraw, setEnableDraw, setEnableSelect } = useTypeContext();

  useEffect(() => {

    const modify = new Modify({
      source: vectorLayer?.getSource() as VectorSource,
    });

    map?.addInteraction(modify);

    const listenerKeyStart = modify.on("modifystart", (e) => {
      setEnableDraw(false);
      setEnableSelect(false);
      document.body.style.cursor = "grab";
    });

    const listenerKeyEnd = modify.on("modifyend", (e) => {
      setEnableDraw(true);
      setEnableSelect(true);
      setCoordinates(e.features.getArray()[0].getGeometry()?.getCoordinates());
      document.body.style.cursor = "default";
    });

    return () => {
        map?.removeInteraction(modify);
        modify.un("modifystart", listenerKeyStart.listener);
        modify.un("modifyend", listenerKeyEnd.listener);
    }

    // Your code here
  }, [map, vectorLayer]);

  return null;
};

export default ModifyInteractions;
