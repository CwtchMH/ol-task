import { Style, Stroke, Fill, Circle as CircleStyle } from "ol/style";

export const styleOrigin = new Style({
  fill: new Fill({
    color: "rgba(173, 216, 230, 0.5)", // Màu xanh dương nhạt
  }),
  stroke: new Stroke({
    color: "rgba(0, 0, 255, 1)", // Màu xanh dương đậm
    width: 2,
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

export const styleDraw = new Style({
  fill: new Fill({
    color: "rgba(144, 238, 144, 0.5)", // Màu xanh lá nhạt
  }),
  stroke: new Stroke({
    color: "rgba(0, 128, 0, 1)", // Màu xanh lá đậm
    width: 2,
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

export const styleModify = new Style({
  fill: new Fill({
    color: "rgba(144, 238, 144, 0.5)", // Màu xanh lá nhạt
  }),
  stroke: new Stroke({
    color: "rgba(0, 128, 0, 1)", // Màu xanh lá đậm
    width: 2,
  }),
});

export const styleTranslate = new Style({
  fill: new Fill({
    color: "rgba(255, 182, 193, 0.5)", // Màu đỏ nhạt
  }),
  stroke: new Stroke({
    color: "rgba(255, 0, 0, 1)", // Màu đỏ đậm
    width: 2,
  }),
});
