import { Style, Stroke, Fill, Circle as CircleStyle } from "ol/style";

export const style = new Style({
  stroke: new Stroke({
    color: "#42a8ed",
    width: 3,
  }),
  fill: new Fill({
    color: "rgba(0, 255, 0, 0.3)",
  }),
  image: new CircleStyle({
    radius: 5,
    fill: new Fill({
      color: "pink",
    }),
    stroke: new Stroke({
      color: "black",
      width: 2,
    }),
  }),
});

export const selectedStyle = new Style({
  stroke: new Stroke({
    color: "#0575c0",
    width: 3,
  }),
  fill: new Fill({
    color: "rgba(213, 216, 29, 0.3)",
  }),
  image: new CircleStyle({
    radius: 7,
    fill: new Fill({
      color: "red",
    }),
    stroke: new Stroke({
      color: "black",
      width: 2,
    }),
  }),
});

export const pointerMoveStyle = new Style({
  stroke: new Stroke({
    color: "black",
    width: 3,
  }),
  fill: new Fill({
    color: "rgba(216, 29, 207, 0.3)",
  }),
  image: new CircleStyle({
    radius: 7,
    fill: new Fill({
      color: "red",
    }),
    stroke: new Stroke({
      color: "#eeeeee",
      width: 2,
    }),
  }),
});

export const selectDoubleClickStyle = new Style({
  stroke: new Stroke({
    color: "red",
    width: 8,
  }),
  fill: new Fill({
    color: "black",
  }),
  image: new CircleStyle({
    radius: 7,
    fill: new Fill({
      color: "red",
    }),
    stroke: new Stroke({
      color: "black",
      width: 2,
    }),
  }),
});
