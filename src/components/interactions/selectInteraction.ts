import { useEffect, useRef } from "react";
import { Map } from "ol";
import VectorLayer from "ol/layer/Vector";
import Select from "ol/interaction/Select";
import Feature from "ol/Feature";
import { useCombinedContext } from "../../hooks/useCombinedContext";

const SelectInteractions = ({
  map,
  vectorLayer,
  setTempFeature,
}: {
  map: Map | null;
  vectorLayer: VectorLayer | null;
  setTempFeature: (tempFeature: Feature | null) => void;
}) => {
  const featureRef = useRef<Feature | null>(null);
  const {
    setEnableDraw,
    setEnableSelect,
    setIsSelected,
    setEnableModify,
    typeInteraction,
    setEnableTranslate,
  } = useCombinedContext();
  useEffect(() => {
    if (!map || !vectorLayer) return;

    const select = new Select({
      layers: [vectorLayer],
      multi: false,
    });

    map.addInteraction(select);

    const listener = select.on("select", (e) => {
      const feature = e.selected[0];
      if (!feature) return;
      featureRef.current = feature;
      console.log("featureRef", featureRef.current);
    });

    const handleDblClick = () => {
      setIsSelected(true);
      setTempFeature(featureRef.current);
      setEnableDraw(false);
      if (typeInteraction === "Modify") {
        setEnableModify(true);
      } else if (typeInteraction === "Translate") {
        setEnableTranslate(true);
      }
      setEnableSelect(false);
    };

    map?.on("dblclick", handleDblClick);

    return () => {
      map.removeInteraction(select);
      select.un("select", listener.listener);
      map.un("dblclick", handleDblClick);
    };
  }, []);

  return null;
};

export default SelectInteractions;
