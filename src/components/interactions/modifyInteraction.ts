import { useEffect, useRef } from "react";
import Modify from "ol/interaction/Modify";
import { Collection, Feature, MapBrowserEvent } from "ol";
import { Map } from "ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { styleModify } from "../../libs/style";
import { useCombinedContext } from "../../hooks/useCombinedContext";

const ModifyInteractions = ({
  map,
  tempFeature,
  vectorLayer,
}: {
  map: Map | null;
  tempFeature: Feature | null;
  vectorLayer: VectorLayer | null;
}) => {
  const modifiedFeatureRef = useRef<Feature | null>(null);

  const { setEnableSelect, setEnableModify, setModifyQuantity } =
    useCombinedContext();

  useEffect(() => {
    console.log("ModifyInteractions");
    if (!map || !tempFeature || !vectorLayer) return;

    const source = vectorLayer.getSource() as VectorSource;

    //console.log(source.getFeatures().length);

    // Tạo một layer riêng để modify
    const sourceModify = new VectorSource();
    const layerModify = new VectorLayer({
      source: sourceModify,
      style: styleModify,
    });

    map.addLayer(layerModify);

    source.removeFeature(tempFeature);
    sourceModify.addFeature(tempFeature);

    // console.log(source.getFeatures().length);
    // console.log(sourceModify.getFeatures().length);

    const modify = new Modify({
      source: sourceModify,
      features: new Collection([tempFeature]),
    });

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

    const handleSingleClick = (e: MapBrowserEvent<UIEvent>) => {
      const featureAtClick = e.coordinate;

      if (!modifiedFeatureRef.current) {
        setEnableSelect(true);
        setEnableModify(false);
        return;
      }

      if (
        !modifiedFeatureRef.current
          .getGeometry()
          ?.intersectsCoordinate(featureAtClick)
      ) {
        setEnableSelect(true);
        setEnableModify(false);
        return;
      }
    };

    const handleDoubleClick = (e: MapBrowserEvent<UIEvent>) => {
      const featureAtDblClick = e.coordinate;

      if (!modifiedFeatureRef.current) {
        console.log("No feature to modify");
        return;
      }

      if (
        modifiedFeatureRef.current
          .getGeometry()
          ?.intersectsCoordinate(featureAtDblClick)
      ) {
        sourceModify.removeFeature(modifiedFeatureRef.current);
        source.addFeature(modifiedFeatureRef.current);

        map.removeInteraction(modify);
        map.removeLayer(layerModify);
        setEnableSelect(true);
        modifiedFeatureRef.current = null;
        alert("Done modifying a feature");
        setModifyQuantity((prev) => prev + 1);
      }
    };

    map.on("dblclick", handleDoubleClick);
    map.on("singleclick", handleSingleClick);

    return () => {
      if (modify) {
        map.removeInteraction(modify);
      }
      if (layerModify) {
        map.removeLayer(layerModify);
      }
      modify.un("modifystart", modifyStartListener.listener);
      modify.un("modifyend", modifyEndListener.listener);
      map.un("dblclick", handleDoubleClick);
      map.un("singleclick", handleSingleClick);
    };
  }, [map, tempFeature, vectorLayer]);

  return null;
};

export default ModifyInteractions;
