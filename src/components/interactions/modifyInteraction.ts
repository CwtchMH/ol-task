import { useEffect, useRef } from "react";
import Modify from "ol/interaction/Modify";
import { Collection, Feature } from "ol";
import { Map } from "ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { styleModify } from "../../libs/style";
import { useCombinedContext } from "../../hooks/useCombinedContext";

const ModifyInteractions = ({
  map,
  tempFeature,
  vectorLayer,
  setIsSelected,
}: {
  map: Map | null;
  tempFeature: Feature | null;
  vectorLayer: VectorLayer | null;
  setIsSelected: (isSelected: boolean) => void;
}) => {
  const modifiedFeatureRef = useRef<Feature | null>(null);

  const { setEnableSelect, setEnableModify } = useCombinedContext();

  useEffect(() => {
    console.log("ModifyInteractions");
    if (!map || !tempFeature || !vectorLayer) return;

    const source = vectorLayer.getSource() as VectorSource;

    const sourceModify = new VectorSource();
    const layerModify = new VectorLayer({
      source: sourceModify,
      style: styleModify,
    });

    map.addLayer(layerModify);

    for (const feature of source.getFeatures()) {
      const geom = feature.getGeometry();
      if (geom && tempFeature?.getGeometry() === geom) {
        source.removeFeature(feature);
      }
    }

    const he = tempFeature.clone();

    sourceModify.addFeature(he);

    const modify = new Modify({
      //source: sourceModify,
      features: new Collection([he]),
    });

    console.log(source.getFeatures().length);

    map.addInteraction(modify);

    const modifyStartListener = modify.on("modifystart", () => {
      document.body.style.cursor = "pointer";
      console.log("Start modifying a feature");
    });

    const modifyEndListener = modify.on("modifyend", (e) => {
      document.body.style.cursor = "default";
      const modifiedFeature = e.features.getArray()[0];
      modifiedFeatureRef.current = modifiedFeature;
    });

    const handleDoubleClick = () => {
      if (!modifiedFeatureRef.current) return;
      sourceModify.removeFeature(modifiedFeatureRef.current);
      source.addFeature(modifiedFeatureRef.current);
      setEnableSelect(true);
      setEnableModify(false);
      setIsSelected(false);
      alert("Feature modified");
      modifiedFeatureRef.current = null;
    };

    map.on("dblclick", handleDoubleClick);

    return () => {
      if (modifiedFeatureRef.current) {
        sourceModify.clear();
        console.log(source.getFeatures().length);
        //source.removeFeature(tempFeature);
        source.addFeature(tempFeature);
        console.log("Feature added back to source");
      }
      if (modify) {
        map.removeInteraction(modify);
      }
      if (layerModify) {
        map.removeLayer(layerModify);
      }
      modify.un("modifystart", modifyStartListener.listener);
      modify.un("modifyend", modifyEndListener.listener);
      map.un("dblclick", handleDoubleClick);
    };
  }, [map, vectorLayer]);

  return null;
};

export default ModifyInteractions;
