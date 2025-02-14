import { Map } from "ol";
import VectorLayer from "ol/layer/Vector";
import Translate from "ol/interaction/Translate";
import { useEffect, useRef } from "react";
import Feature from "ol/Feature";
import VectorSource from "ol/source/Vector";
import { styleTranslate } from "../../libs/style";
import { Collection } from "ol";
import { useCombinedContext } from "../../hooks/useCombinedContext";

const TranslateInteractions = ({
  map,
  vectorLayer,
  tempFeature,
  setIsSelected,
}: {
  map: Map | null;
  vectorLayer: VectorLayer | null;
  tempFeature: Feature | null;
  setIsSelected: (isSelected: boolean) => void;
}) => {
  // const selectedFeatureRef = useRef<Feature | null>(null);
  // const extraFeatureRef = useRef<Feature | null>(null);

  const { setEnableSelect, setEnableTranslate } = useCombinedContext();
  const featureTranslateRef = useRef<Feature | null>(null);

  useEffect(() => {
    if (!map || !vectorLayer || !tempFeature) return;

    const source = vectorLayer.getSource() as VectorSource;

    const sourceTranslate = new VectorSource({ wrapX: false });

    const vectorTranslate = new VectorLayer({
      source: sourceTranslate,
      style: styleTranslate,
    });

    map.addLayer(vectorTranslate);

    for (const feature of source.getFeatures()) {
      const geom = feature.getGeometry();
      if (geom && tempFeature?.getGeometry() === geom) {
        source.removeFeature(feature);
      }
    }

    const featureClone = tempFeature.clone();
    featureTranslateRef.current = featureClone;

    sourceTranslate.addFeature(featureClone);

    const translate = new Translate({
      features: new Collection([featureClone]),
    });

    map.addInteraction(translate);

    const handleDblClick = () => {
      if (!featureClone) return;
      source.addFeature(featureClone);
      sourceTranslate.clear();
      alert("Feature translated");
      setEnableSelect(true);
      setEnableTranslate(false);
      setIsSelected(false);
      featureTranslateRef.current = null;
    };

    map.on("dblclick", handleDblClick);

    return () => {
      if (featureTranslateRef.current) {
        source.addFeature(tempFeature);
        sourceTranslate.clear();
      }
      map.removeLayer(vectorTranslate);
      map.removeInteraction(translate);
      map.un("dblclick", handleDblClick);
    };
  }, []);

  return null;
};

export default TranslateInteractions;
