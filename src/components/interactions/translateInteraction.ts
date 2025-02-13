import { Map } from "ol";
import VectorLayer from "ol/layer/Vector";
import Translate from "ol/interaction/Translate";
import { useEffect } from "react";
import Feature from "ol/Feature";
import VectorSource from "ol/source/Vector";
import { styleTranslate } from "../../libs/style";
import { Collection } from "ol";

const TranslateInteractions = ({
  map,
  vectorLayer,
  tempFeature,
}: {
  map: Map | null;
  vectorLayer: VectorLayer | null;
  tempFeature: Feature | null;
}) => {
  // const selectedFeatureRef = useRef<Feature | null>(null);
  // const extraFeatureRef = useRef<Feature | null>(null);

  useEffect(() => {
    if (!map || !vectorLayer) return;

    const source = vectorLayer.getSource() as VectorSource;

    const sourceTranslate = new VectorSource({ wrapX: false });

    const vectorTranslate = new VectorLayer({
      source: sourceTranslate,
      style: styleTranslate,
    });

    map.addLayer(vectorTranslate);

    const translate = new Translate({
      features: new Collection(tempFeature ? [tempFeature] : []),
    });

    map.addInteraction(translate);

    const handleDblClick = () => {
      if (!tempFeature) return;
      source.removeFeature(tempFeature);
    };

    map.on("dblclick", handleDblClick);

    return () => {
      map.removeLayer(vectorTranslate);
      map.removeInteraction(translate);
      map.un("dblclick", handleDblClick);
    };
  }, []);

  return null;
};

export default TranslateInteractions;
