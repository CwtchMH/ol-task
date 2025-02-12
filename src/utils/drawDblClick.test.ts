import VectorSource from "ol/source/Vector";
import { drawDblClick } from "./drawDblClick";
import { Feature } from "ol";
import { vi } from "vitest";
import Polygon from "ol/geom/Polygon";
import Point from "ol/geom/Point";
import LineString from "ol/geom/LineString";

describe("drawDblClick test", () => {
  let source: VectorSource;
  let sourceDraw: VectorSource;
  let setIsDrawing: (isDrawing: boolean) => void;
  let addFeatureSpy: ReturnType<typeof vi.spyOn>;
  let clearSpy: ReturnType<typeof vi.spyOn>;
  let alertSpy: ReturnType<typeof vi.spyOn>;

  let featuresArray: Feature[];

  beforeEach(() => {
    source = new VectorSource();
    sourceDraw = new VectorSource();
    setIsDrawing = vi.fn();

    clearSpy = vi.spyOn(sourceDraw, "clear").mockImplementation(() => {
      featuresArray = [];
    });

    addFeatureSpy = vi.spyOn(source, "addFeatures");
    alertSpy = vi.spyOn(window, "alert");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should add features to source on double click", () => {
    featuresArray = [new Feature()];

    vi.spyOn(sourceDraw, "getFeatures").mockImplementation(() => featuresArray);

    expect(sourceDraw.getFeatures().length).toBeGreaterThan(0);

    const handler = drawDblClick({
      source,
      sourceDraw,
      setIsDrawing,
    });
    handler();

    expect(clearSpy).toHaveBeenCalledTimes(1);
    expect(source.getFeatures().length).toBeGreaterThan(0);
    expect(sourceDraw.getFeatures().length).toBe(0);
    expect(addFeatureSpy).toHaveBeenCalled();
    expect(document.body.style.cursor).toBe("default");
    expect(alertSpy).toHaveBeenCalledWith("Done drawing a feature");
    expect(setIsDrawing).toHaveBeenCalledWith(false);
  });

  it("should exist polygon in source when double click", () => {
    featuresArray = [
      new Feature(
        new Polygon([
          [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
            [0, 0],
          ],
        ]),
      ),
    ];
    vi.spyOn(sourceDraw, "getFeatures").mockImplementation(() => featuresArray);

    expect(sourceDraw.getFeatures().length).toBeGreaterThan(0);
    const handler = drawDblClick({
      source,
      sourceDraw,
      setIsDrawing,
    });
    handler();

    expect(clearSpy).toHaveBeenCalledTimes(1);
    expect(source.getFeatures().length).toBe(1);
    expect(sourceDraw.getFeatures().length).toBe(0);
    expect(addFeatureSpy).toHaveBeenCalled();
    expect(document.body.style.cursor).toBe("default");
    expect(alertSpy).toHaveBeenCalledWith("Done drawing a feature");
    expect(setIsDrawing).toHaveBeenCalledWith(false);
  });

  it("should exist point in source when double click", () => {
    featuresArray = [new Feature(new Point([0, 0]))];
    vi.spyOn(sourceDraw, "getFeatures").mockImplementation(() => featuresArray);

    expect(sourceDraw.getFeatures().length).toBeGreaterThan(0);
    const handler = drawDblClick({
      source,
      sourceDraw,
      setIsDrawing,
    });
    handler();

    expect(clearSpy).toHaveBeenCalledTimes(1);
    expect(source.getFeatures().length).toBe(1);
    expect(sourceDraw.getFeatures().length).toBe(0);
    expect(addFeatureSpy).toHaveBeenCalled();
    expect(document.body.style.cursor).toBe("default");
    expect(alertSpy).toHaveBeenCalledWith("Done drawing a feature");
    expect(setIsDrawing).toHaveBeenCalledWith(false);
  });

  it("should exist linestring in source when double click", () => {
    featuresArray = [
      new Feature(
        new LineString([
          [0, 0],
          [1, 0],
        ]),
      ),
    ];
    vi.spyOn(sourceDraw, "getFeatures").mockImplementation(() => featuresArray);

    expect(sourceDraw.getFeatures().length).toBeGreaterThan(0);
    const handler = drawDblClick({
      source,
      sourceDraw,
      setIsDrawing,
    });
    handler();

    expect(clearSpy).toHaveBeenCalledTimes(1);
    expect(source.getFeatures().length).toBe(1);
    expect(sourceDraw.getFeatures().length).toBe(0);
    expect(addFeatureSpy).toHaveBeenCalled();
    expect(document.body.style.cursor).toBe("default");
    expect(alertSpy).toHaveBeenCalledWith("Done drawing a feature");
    expect(setIsDrawing).toHaveBeenCalledWith(false);
  });

  it("should exist 2 features in source when double click after drawing 2 features", () => {
    featuresArray = [
      new Feature(new Point([0, 0])),
      new Feature(new Point([1, 1])),
    ];
    vi.spyOn(sourceDraw, "getFeatures").mockImplementation(() => featuresArray);

    expect(sourceDraw.getFeatures().length).toBeGreaterThan(0);
    const handler = drawDblClick({
      source,
      sourceDraw,
      setIsDrawing,
    });
    handler();

    expect(clearSpy).toHaveBeenCalledTimes(1);
    expect(source.getFeatures().length).toBe(2);
    expect(sourceDraw.getFeatures().length).toBe(0);
    expect(addFeatureSpy).toHaveBeenCalled();
    expect(document.body.style.cursor).toBe("default");
    expect(alertSpy).toHaveBeenCalledWith("Done drawing a feature");
    expect(setIsDrawing).toHaveBeenCalledWith(false);
  });
});
