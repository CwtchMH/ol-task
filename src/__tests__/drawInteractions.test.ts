import { renderHook, act } from "@testing-library/react-hooks";
import { Feature, Map } from "ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Draw from "ol/interaction/Draw";
import { DrawInteractions } from "../components/interactions/drawInteraction";
import Event from "ol/events/Event";
import { vi } from "vitest";

describe("DrawInteractions", () => {
  let map: Map;
  let vectorLayer: VectorLayer;
  let geometryType: string;
  let enableDraw: boolean;

  beforeEach(() => {
    map = new Map();
    vectorLayer = new VectorLayer({ source: new VectorSource() });
    geometryType = "Polygon";
    enableDraw = true;
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should handle single click to start drawing", () => {
    renderHook(() =>
      DrawInteractions({ map, vectorLayer, geometryType, enableDraw }),
    );

    const drawInteraction = map
      .getInteractions()
      .getArray()
      .find((interaction) => interaction instanceof Draw) as Draw;
    expect(drawInteraction).toBeDefined();

    act(() => {
      map.dispatchEvent({ type: "singleclick" } as Event);
    });

    expect(drawInteraction.getActive()).toBe(true);
  });

  it("should add feature to source after drawing", () => {
    renderHook(() =>
      DrawInteractions({ map, vectorLayer, geometryType, enableDraw }),
    );

    const drawInteraction = map
      .getInteractions()
      .getArray()
      .find((interaction) => interaction instanceof Draw) as Draw;
    expect(drawInteraction).toBeDefined();
    const sourceDraw = drawInteraction.get("mySource") as VectorSource;
    expect(sourceDraw).toBeDefined();

    sourceDraw.addFeature(new Feature());

    expect(sourceDraw.getFeatures().length).toBe(1);

    // Simulate double click to finish drawing
    act(() => {
      map.dispatchEvent(new Event("dblclick"));
    });

    expect(vectorLayer.getSource()?.getFeatures().length).toBe(1);
    expect(sourceDraw.getFeatures().length).toBe(0);
  });

  it("should handle double click to add 2 features", () => {
    renderHook(() =>
      DrawInteractions({ map, vectorLayer, geometryType, enableDraw }),
    );

    const drawInteraction = map
      .getInteractions()
      .getArray()
      .find((interaction) => interaction instanceof Draw) as Draw;
    expect(drawInteraction).toBeDefined();
    const sourceDraw = drawInteraction.get("mySource") as VectorSource;

    expect(sourceDraw).toBeDefined();
    sourceDraw.addFeature(new Feature());
    sourceDraw.addFeature(new Feature());
    expect(sourceDraw.getFeatures().length).toBe(2);
    act(() => {
      map.dispatchEvent(new Event("dblclick"));
    });

    expect(vectorLayer.getSource()?.getFeatures().length).toBe(2);

    expect(sourceDraw.getFeatures().length).toBe(0);
  });
});
