import { Map, MapBrowserEvent } from "ol";
import VectorLayer from "ol/layer/Vector";
import Translate from "ol/interaction/Translate";
import Select from "ol/interaction/Select";
import { useEffect, useRef } from "react";
import Feature from "ol/Feature";
import VectorSource from "ol/source/Vector";
import { styleTranslate } from "../../libs/style";

const TranslateInteractions = ({
  map,
  vectorLayer,
}: {
  map: Map | null;
  vectorLayer: VectorLayer | null;
}) => {
  const selectedFeatureRef = useRef<Feature | null>(null);
  const extraFeatureRef = useRef<Feature | null>(null);

  useEffect(() => {
    if (!map || !vectorLayer) return;

    const sourceTranslate = new VectorSource({ wrapX: false });

    const vectorTranslate = new VectorLayer({
      source: sourceTranslate,
      style: styleTranslate,
    });

    map.addLayer(vectorTranslate);

    const select = new Select({ multi: false });

    const translate = new Translate({
      features: select.getFeatures(),
    });

    map.addInteraction(select);
    map.addInteraction(translate);

    const listener = select.on("select", (e) => {
      const feature = e.selected[0];

      console.log("Selected feature", e.selected[0]);

      extraFeatureRef.current = feature;

      selectedFeatureRef.current = feature;

      vectorLayer?.getSource()?.removeFeature(feature);
      sourceTranslate.addFeature(selectedFeatureRef.current);
    });

    const handleSingleClick = (e: MapBrowserEvent<UIEvent>) => {
      const featureAtClick = e.coordinate;

      if (!selectedFeatureRef.current) {
        return;
      }

      if (
        !selectedFeatureRef.current
          .getGeometry()
          ?.intersectsCoordinate(featureAtClick)
      ) {
        vectorLayer?.getSource()?.addFeature(extraFeatureRef.current);
        sourceTranslate.clear();
        extraFeatureRef.current = null;
      } else {
        return;
      }
    };

    const handleDblClick = (e: MapBrowserEvent<UIEvent>) => {
      const featureAtDblClick = e.coordinate;

      if (!selectedFeatureRef.current) {
        return;
      }

      if (
        selectedFeatureRef.current
          .getGeometry()
          ?.intersectsCoordinate(featureAtDblClick)
      ) {
        console.log(vectorLayer?.getSource()?.getFeatures().length);
        console.log("Feature intersects at double click");
        vectorLayer?.getSource()?.addFeature(selectedFeatureRef.current);
        console.log(vectorLayer?.getSource()?.getFeatures().length);
        sourceTranslate.clear();
        selectedFeatureRef.current = null;
        extraFeatureRef.current = null;
        select.getFeatures().clear();
      } else {
        console.log("Feature does not intersect at double click");
        vectorLayer?.getSource()?.addFeature(extraFeatureRef.current);
        sourceTranslate.clear();
        extraFeatureRef.current = null;
      }
    };

    map.on("dblclick", handleDblClick);
    map.on("singleclick", handleSingleClick);

    return () => {
      map.removeLayer(vectorTranslate);
      map.removeInteraction(select);
      map.removeInteraction(translate);
      select.un("select", listener.listener);
      map.un("dblclick", handleDblClick);
      map.un("singleclick", handleSingleClick);
    };
  }, [map, vectorLayer]);

  return null;
};

export default TranslateInteractions;
