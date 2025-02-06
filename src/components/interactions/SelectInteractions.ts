import { useEffect } from "react";
import { Map } from "ol";
import VectorLayer from "ol/layer/Vector";
import { ICoordinates } from "../../@types/type";
import Select from "ol/interaction/Select";
import { useTypeContext } from "../../context/TypeContext";
import Feature from "ol/Feature";
import { SimpleGeometry } from "ol/geom";
import { click } from "ol/events/condition";

const SelectInteractions = ({
  map,
  vectorLayer,
  setCoordinates,
  setIsSelected,
  setTempFeature,
}: {
  map: Map | null;
  vectorLayer: VectorLayer | null;
  setCoordinates: (coordinates: ICoordinates) => void;
  setIsSelected: (isSelected: boolean) => void;
  setTempFeature: (tempFeature: Feature | null) => void;
}) => {
  const { setEnableModify, setEnableDraw, setEnableSelect, enableSelect } =
    useTypeContext();
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
      if (feature instanceof SimpleGeometry) {
        setCoordinates(feature.getCoordinates() as ICoordinates);
      }
      setIsSelected(true);
      console.log("Selected feature", typeof feature);
      setTempFeature(new Feature(feature.getGeometry()));
      console.log("Selected feature", feature);
      setEnableModify(true);
      setEnableDraw(false);
      setEnableSelect(false);

      console.log(vectorLayer.getSource()?.getFeatures().length);
    });

    return () => {
      map.removeInteraction(select);
      select.un("select", listener.listener);
    };
  }, [map, vectorLayer, enableSelect]);

  return null;
};

export default SelectInteractions;
