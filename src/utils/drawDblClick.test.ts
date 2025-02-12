import VectorSource from "ol/source/Vector";
import { drawDblClick } from "./drawDblClick";
import { Feature, MapBrowserEvent } from "ol";
import { vi } from "vitest";

describe("drawDblClick test", () => {
  let source: VectorSource = new VectorSource();
  let sourceDraw: VectorSource = new VectorSource();
  let featureRef: { current: Feature | null };
  let setIsDrawing: (isDrawing: boolean) => void;

  const addFeatureSpy = vi.spyOn(source, "addFeature");
  const hasFeatureSpy = vi.spyOn(source, "hasFeature");
  const clearSpy = vi.spyOn(sourceDraw, "clear");
  const alertSpy = vi.spyOn(window, "alert");

  beforeEach(() => {
    source = new VectorSource();
    sourceDraw = new VectorSource();
    featureRef = { current: new Feature() };
    setIsDrawing = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should add a new feature to source on double click", () => {
    // featureRef.current!.getGeometry = vi.fn().mockReturnValue({
    //   intersectsCoordinate: vi.fn().mockReturnValue(true),
    // });

    hasFeatureSpy.mockReturnValue(false);

    expect(source.getFeatures().length).toBe(0);

    const handler = drawDblClick({
      source,
      sourceDraw,
      setIsDrawing,
    });
    handler();

    expect(clearSpy).toHaveBeenCalledTimes(2);
    expect(source.getFeatures().length).toBe(1);
    expect(sourceDraw.getFeatures().length).toBe(0);
    expect(addFeatureSpy).toHaveBeenCalled();
    expect(document.body.style.cursor).toBe("default");
    expect(alertSpy).toHaveBeenCalledWith("Done drawing a feature");
    expect(setIsDrawing).toHaveBeenCalledWith(false);
  });

  //   it("should not add a feature if it already exists in source", () => {
  //     const mockEvent = {
  //       coordinate: [0, 0],
  //     } as unknown as MapBrowserEvent<UIEvent>;

  //     featureRef.current!.getGeometry = vi.fn().mockReturnValue({
  //       intersectsCoordinate: vi.fn().mockReturnValue(true),
  //     });

  //     hasFeatureSpy.mockReturnValue(true);

  //     const handler = drawDblClick({
  //       source,
  //       sourceDraw,
  //       featureRef,
  //       setIsDrawing,
  //     });
  //     handler(mockEvent);

  //     expect(addFeatureSpy).not.toHaveBeenCalled();
  //     expect(alertSpy).not.toHaveBeenCalled();
  //     expect(setIsDrawing).not.toHaveBeenCalled();
  //   });

  it("should not add a feature if featureRef.current is null", () => {
    const mockEvent = {
      coordinate: [0, 0],
    } as unknown as MapBrowserEvent<UIEvent>;

    featureRef.current = null;

    const handler = drawDblClick({
      source,
      sourceDraw,
      featureRef,
      setIsDrawing,
    });
    handler(mockEvent);

    expect(sourceDraw.getFeatures().length).toBe(0);
    expect(addFeatureSpy).not.toHaveBeenCalled();
    expect(alertSpy).not.toHaveBeenCalled();
    expect(setIsDrawing).not.toHaveBeenCalled();
  });
});
