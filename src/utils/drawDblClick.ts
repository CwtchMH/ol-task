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
      source.addFeatures(sourceDraw.getFeatures());
      sourceDraw.clear();
      document.body.style.cursor = "default";
      alert("Done drawing a feature");
      setIsDrawing(false);
      console.log(source.getFeatures().length);
    }
  };
};
