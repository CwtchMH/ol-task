import { useEffect, useState } from "react";
import { Map } from "ol";
import VectorLayer from "ol/layer/Vector";
import { ICoordinates } from "../../@types/type";
import Select from "ol/interaction/Select";
import { selectedStyle, selectDoubleClickStyle, style } from "../../libs/style";
import TileLayer from "ol/layer/Tile";
import { useTypeContext } from "../../context/TypeContext";
import { set } from "ol/transform";

const SelectInteractions = ({
  map,
  vectorLayer,
  raster,
  setCoordinates,
  setIsSelected,
  setTempFeature,
}: {
  map: Map | null;
  vectorLayer: VectorLayer | null;
  raster: TileLayer | null;
  setCoordinates: (coordinates: ICoordinates) => void;
  setIsSelected: (isSelected: boolean) => void;
  setTempFeature: (tempFeature: any) => void;
}) => {
  const { setEnableModify, setEnableDraw } = useTypeContext();
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
        const feature = selectedFeatures[0];

        console.log(feature.getGeometry()?.getCoordinates());

        feature.setStyle(selectedStyle);
        setIsSelected(true);

        setCoordinates(feature.getGeometry()?.getCoordinates());
        setEnableModify(false);
        setEnableDraw(false);
        setTempFeature(feature);
      } else {
        setEnableModify(true);
        setIsSelected(false);
        setEnableDraw(true);
        setTempFeature(null);
        setCoordinates([]);
      }
    });

    return () => {
      map?.removeInteraction(select);
      select.un("select", listenerKey.listener);
    };
  }, [map, vectorLayer, raster]);

  return null;
};

export default SelectInteractions;
