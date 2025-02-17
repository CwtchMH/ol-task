import { useEffect, useRef } from "react";
import Modify from "ol/interaction/Modify";
import { Collection, Feature } from "ol";
import { Map } from "ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { styleModify } from "../../libs/style";

const ModifyInteractions = ({
  map,
  tempFeature,
  vectorLayer,
  setIsSelected,
  setEnableSelect,
  setEnableModify,
}: {
  map: Map | null;
  tempFeature: Feature | null;
  vectorLayer: VectorLayer | null;
  setIsSelected: (isSelected: boolean) => void;
  setEnableSelect: (enableSelect: boolean) => void;
  setEnableModify: (enableModify: boolean) => void;
}) => {
  const modifiedFeatureRef = useRef<Feature | null>(null);

  const quantitySource = vectorLayer?.getSource()?.getFeatures().length;

  useEffect(() => {
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

    const featureClone = tempFeature.clone();

    sourceModify.addFeature(featureClone);

    const modify = new Modify({
      //source: sourceModify,
      features: new Collection([featureClone]),
    });

    modify.set("mySource", sourceModify);
    map.addInteraction(modify);

    const modifyStartListener = modify.on("modifystart", () => {
      document.body.style.cursor = "pointer";
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
        source.addFeature(tempFeature);
      }
      if (quantitySource !== source.getFeatures().length) {
        source.addFeature(tempFeature);
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
  }, []);

  return null;
};

export default ModifyInteractions;
