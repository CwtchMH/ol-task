import VectorSource from "ol/source/Vector";

export const drawDblClick = ({
  source,
  sourceDraw,
  setIsDrawing,
}: {
  source: VectorSource;
  sourceDraw: VectorSource;
  setIsDrawing: (value: boolean) => void;
}) => {
  return () => {
    //sourceDraw.clear();

    const featureLast =
      sourceDraw.getFeatures()[sourceDraw.getFeatures().length - 1];

    console.log(sourceDraw.getFeatures().length);

    if (featureLast.getGeometry()?.getType() === "Point") {
      console.log("Point");
      sourceDraw.removeFeature(featureLast);
      sourceDraw.removeFeature(
        sourceDraw.getFeatures()[sourceDraw.getFeatures().length - 1],
      );
    }

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
