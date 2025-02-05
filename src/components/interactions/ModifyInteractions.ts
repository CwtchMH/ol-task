import { useEffect, useState } from "react";
import Modify from "ol/interaction/Modify";
import { Collection, Feature } from "ol";
import { Map } from "ol";
import VectorLayer from "ol/layer/Vector";
import { ICoordinates } from "../../@types/type";
import VectorSource from "ol/source/Vector";
import { styleModify } from "../../libs/style";
import { SimpleGeometry } from "ol/geom";

const ModifyInteractions = ({
  map,
  setCoordinates,
  tempFeature,
  vectorLayer,
}: {
  map: Map | null;
  setCoordinates: (coordinates: ICoordinates) => void;
  tempFeature: Feature | null;
  vectorLayer: VectorLayer | null;
}) => {
  const [modifyInteraction, setModifyInteraction] = useState<Modify | null>(
    null,
  );
  const [layerModify, setLayerModify] = useState<VectorLayer | null>(null);
  const [modifiedFeature, setModifiedFeature] = useState<Feature | null>(null);

  useEffect(() => {
    if (!map || !tempFeature || !vectorLayer) return;

    const source = vectorLayer.getSource() as VectorSource;

    // Tạo một layer riêng để modify
    const sourceModify = new VectorSource();
    const layerModify1 = new VectorLayer({
      source: sourceModify,
      style: styleModify,
    });

    map.addLayer(layerModify1);
    setLayerModify(layerModify);

    // Di chuyển feature từ layer tổng sang layer modify
    source.removeFeature(tempFeature);
    sourceModify.addFeature(tempFeature);

    // Tạo modify interaction
    const modify = new Modify({
      source: sourceModify,
      features: new Collection([tempFeature]),
    });

    map.addInteraction(modify);
    setModifyInteraction(modify);

    // Xử lý sự kiện khi modify kết thúc
    const modifyEndListener = modify.on("modifyend", (e) => {
      const modifiedFeature = e.features.getArray()[0];
      setModifiedFeature(modifiedFeature); // Lưu feature đã chỉnh sửa

      if (modifiedFeature instanceof SimpleGeometry) {
        setCoordinates(
          modifiedFeature.getGeometry()?.get("Coordinates") as ICoordinates,
        );
      }
    });

    // Xử lý sự kiện double click để lưu thay đổi
    const handleDoubleClick = () => {
      if (modifiedFeature) {
        // Di chuyển feature từ layer modify ngược lại vào layer tổng
        sourceModify.removeFeature(modifiedFeature);
        source.addFeature(modifiedFeature);

        map.removeInteraction(modify);
        map.removeLayer(layerModify1);
        setModifyInteraction(null);
        setLayerModify(null);
        setModifiedFeature(null);
      }
    };

    map.on("dblclick", handleDoubleClick);

    // Cleanup
    return () => {
      if (modifyInteraction) {
        map.removeInteraction(modifyInteraction);
      }
      if (layerModify) {
        map.removeLayer(layerModify);
      }
      modify.un("modifyend", modifyEndListener.listener);
      map.un("dblclick", handleDoubleClick);
    };
  }, [map, tempFeature, vectorLayer]);

  return null;
};

export default ModifyInteractions;
