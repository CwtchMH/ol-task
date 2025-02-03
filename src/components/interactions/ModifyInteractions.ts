import { useEffect, useState } from "react";
import Modify from "ol/interaction/Modify";
import { Collection, Feature } from "ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Map } from "ol";
import { ICoordinates } from "../../@types/type";
import { selectDoubleClickStyle } from "../../libs/style";
import { clone } from "ol/extent";

const ModifyInteractions = ({
  map,
  setCoordinates,
  tempFeature,
  mainVectorLayer,
  vectorSource,
}: {
  map: Map | null;
  setCoordinates: (coordinates: ICoordinates) => void;
  tempFeature: any;
  mainVectorLayer: VectorLayer | null;
  vectorSource: VectorSource | null;
}) => {
  const [isModifying, setIsModifying] = useState<boolean>(false);
  const [clonedFeature, setClonedFeature] = useState<Feature | null>(null);
  const [modifyInteraction, setModifyInteraction] = useState<Modify | null>(
    null
  );

  useEffect(() => {
    if (!map || !tempFeature || !vectorSource) return;

    const handleDoubleClick = (e) => {
      if (!isModifying) {
        // Tạo bản sao của feature hiện tại
        const cloned = tempFeature.clone();
        setClonedFeature(cloned);

        // Thêm bản sao vào vector source
        cloned.setStyle(selectDoubleClickStyle);
        vectorSource.addFeature(cloned);

        // Tạo modify interaction và thêm vào map
        const modify = new Modify({
          features: new Collection([cloned]),
          style: selectDoubleClickStyle,
        });
        map.addInteraction(modify);
        setModifyInteraction(modify);

        setIsModifying(true);
      } else {
        // Kết thúc chỉnh sửa, ghi đè feature cũ bằng feature mới
        if (clonedFeature) {
          tempFeature.setGeometry(clonedFeature.getGeometry().clone());
          setCoordinates(tempFeature.getGeometry().getCoordinates());
          vectorSource.removeFeature(clonedFeature);
          setClonedFeature(null);
        }

        // Xóa modify interaction khỏi map
        if (modifyInteraction) {
          map.removeInteraction(modifyInteraction);
          setModifyInteraction(null);
        }

        setIsModifying(false);
      }
    };

    map.on("dblclick", handleDoubleClick);

    return () => {
      map.un("dblclick", handleDoubleClick);
      if (modifyInteraction) {
        map.removeInteraction(modifyInteraction);
      }
    };
  }, [
    map,
    tempFeature,
    vectorSource,
    isModifying,
    clonedFeature,
    modifyInteraction,
  ]);

  return null;
};

export default ModifyInteractions;
