import VectorSource from "ol/source/Vector";

export const drawDblClick = ({
  source,
  sourceDraw,
  setIsDrawing,
}: {
  source: VectorSource;
  sourceDraw: VectorSource;
  setIsDrawing: (isDrawing: boolean) => void;
}) => {
  return () => {
    //sourceDraw.clear();

    if (sourceDraw.getFeatures().length) {
      // const feature = featureRef.current;
      // source.addFeature(feature.clone());
      // featureRef.current = null;
      // sourceDraw.clear();
      // document.body.style.cursor = "default";
      // console.log(source.getFeatures().length);
      // alert("Done drawing a feature");
      // setIsDrawing(false);
      source.addFeatures(sourceDraw.getFeatures());
      sourceDraw.clear();
      document.body.style.cursor = "default";
      alert("Done drawing a feature");
      setIsDrawing(false);
      console.log(source.getFeatures().length);
    }
  };
};
