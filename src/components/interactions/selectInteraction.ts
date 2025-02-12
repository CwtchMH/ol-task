import { useEffect } from "react";
import { Map } from "ol";
import VectorLayer from "ol/layer/Vector";
import Select from "ol/interaction/Select";
import { useTypeContext } from "../../context/TypeContext";
import Feature from "ol/Feature";
import { click } from "ol/events/condition";

const SelectInteractions = ({
  map,
  vectorLayer,
  setIsSelected,
  setTempFeature,
}: {
  map: Map | null;
  vectorLayer: VectorLayer | null;
  setIsSelected: (isSelected: boolean) => void;
  setTempFeature: (tempFeature: Feature | null) => void;
}) => {
  const { setEnableModify, setEnableDraw, setEnableSelect } = useTypeContext();
  useEffect(() => {
    if (!map || !vectorLayer) return;

    // const source = vectorLayer.getSource() as Source;

    const select = new Select({
      layers: [vectorLayer],
      condition: click,
      multi: false,
    });

    map.addInteraction(select);

    const listener = select.on("select", (e) => {
      const feature = e.selected[0];
      setIsSelected(true);
      setTempFeature(new Feature(feature.getGeometry()));
      setEnableModify(true);
      setEnableDraw(false);
      setEnableSelect(false);

      console.log(vectorLayer.getSource()?.getFeatures().length);
    });

    return () => {
      map.removeInteraction(select);
      select.un("select", listener.listener);
    };
  }, [map, vectorLayer]);

  return null;
};

export default SelectInteractions;
