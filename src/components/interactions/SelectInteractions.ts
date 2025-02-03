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

            selectedFeatures.forEach((feature) => {
                feature.setStyle(selectedStyle);
            });

            setCoordinates(e.selected[0].getGeometry()?.getCoordinates());

        });


        return () => {
            map?.removeInteraction(select);
            select.un("select", listenerKey.listener);
            
        }

    }, []);

    return null;
}

export default SelectInteractions;