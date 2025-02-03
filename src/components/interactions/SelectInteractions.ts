import { useEffect } from "react";
import { Map } from "ol";
import VectorLayer from "ol/layer/Vector";
import { ICoordinates } from "../../@types/type";
import Select from "ol/interaction/Select";
import { selectedStyle } from "../../libs/style";
import TileLayer from "ol/layer/Tile";
import { useTypeContext } from "../../context/TypeContext";
import { set } from "ol/transform";

const SelectInteractions = ({
  map,
  vectorLayer,
  raster,
  setCoordinates
}: {
  map: Map | null;
  vectorLayer: VectorLayer | null;
    raster: TileLayer | null;
  setCoordinates: (coordinates: ICoordinates) => void;
}) => {

  const { setEnableDraw, setEnableModify } = useTypeContext();

    useEffect(() => {
        // Your code here

        const select = new Select({
            layers: [vectorLayer as VectorLayer, raster as TileLayer],
            multi: false,
        });

        map?.addInteraction(select);

        const listenerKey = select.on("select", (e) => {
          const selectedFeatures = e.selected;

          if (selectedFeatures.length > 0) {
            setEnableDraw(false); // Vô hiệu hóa vẽ
            setEnableModify(false); // Vô hiệu hóa chỉnh sửa (nếu cần)
          } else {
            setEnableDraw(true); // Kích hoạt lại vẽ nếu không có đối tượng nào được chọn
            setEnableModify(true); // Kích hoạt lại chỉnh sửa (nếu cần)
          }

          // Áp dụng style cho tất cả các đối tượng được chọn
          selectedFeatures.forEach((feature) => {
            feature.setStyle(selectedStyle);
          });

          // Kiểm tra và cập nhật tọa độ nếu có đối tượng được chọn
          if (selectedFeatures.length > 0) {
            const coordinates = selectedFeatures[0]
              .getGeometry()
              ?.getCoordinates();
            if (coordinates) {
              setCoordinates(coordinates);
            }
          } else {
            setCoordinates(null);
          }
        });

        return () => {
            map?.removeInteraction(select);
            select.un("select", listenerKey.listener);
            
        }

    }, [map, vectorLayer, raster]);

    return null;
}

export default SelectInteractions;