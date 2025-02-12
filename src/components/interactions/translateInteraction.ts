import { Map, MapBrowserEvent } from "ol";
import VectorLayer from "ol/layer/Vector";
import Translate from "ol/interaction/Translate";
import Select from "ol/interaction/Select";
import { useEffect, useRef } from "react";
import Feature from "ol/Feature";
import VectorSource from "ol/source/Vector";
import { styleTranslate } from "../../libs/style";
import { useCombinedContext } from "../../hooks/useCombinedContext";

const TranslateInteractions = ({
  map,
  vectorLayer,
}: {
  map: Map | null;
  vectorLayer: VectorLayer | null;
}) => {
  const selectedFeatureRef = useRef<Feature | null>(null);
  const extraFeatureRef = useRef<Feature | null>(null);

  const { setTranslateQuantity } = useCombinedContext();

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

    // Hàm xử lý double click
    const handleDblClick = (e: MapBrowserEvent<UIEvent>) => {
      const clickCoordinate = e.coordinate;
      const clickPixel = e.pixel;
      const hitTolerancePixel = 5; // Điều chỉnh theo nhu cầu (pixel)

      const featureAtPixel = map.forEachFeatureAtPixel(
        clickPixel,
        (feature) => feature,
        { hitTolerance: hitTolerancePixel },
      );

      if (!selectedFeatureRef.current) return;

      const geometry = selectedFeatureRef.current.getGeometry();
      if (!geometry) return;

      let isHit = false;

      // Xác định loại geometry để áp dụng cách hit test phù hợp
      switch (geometry.getType()) {
        case "Polygon":
        case "MultiPolygon":
          // Với Polygon, dùng phương thức intersectsCoordinate
          isHit = geometry.intersectsCoordinate(clickCoordinate);
          break;

        case "Point":
        case "MultiPoint":
        case "LineString":
        case "MultiLineString":
          // Với Point và LineString, sử dụng hit test dựa trên pixel
          // Lưu ý: hit test sẽ duyệt qua tất cả feature tại vị trí clickPixel trên map
          // Nếu feature tại pixel khớp với selectedFeature, ta xem là nhấn trúng
          isHit = featureAtPixel === selectedFeatureRef.current;
          break;

        default:
          // Nếu geometry khác, cố gắng sử dụng intersectsCoordinate nếu có
          if (typeof geometry.intersectsCoordinate === "function") {
            isHit = geometry.intersectsCoordinate(clickCoordinate);
          }
          break;
      }

      if (isHit) {
        // Khi hit test thành công
        vectorLayer?.getSource()?.addFeature(selectedFeatureRef.current);
        sourceTranslate.clear();
        selectedFeatureRef.current = null;
        extraFeatureRef.current = null;
        select.getFeatures().clear();
        setTranslateQuantity((prev) => prev + 1);
        alert("Done translating a feature");
      } else {
        // Khi không hit test được feature
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
