import { renderHook, act } from "@testing-library/react-hooks";
import { vi } from "vitest";
import { ModifyInteractions } from "../components/interactions";
import { Map } from "ol";
import Feature from "ol/Feature";
import VectorLayer from "ol/layer/Vector";
import Modify from "ol/interaction/Modify";
import VectorSource from "ol/source/Vector";
import { Point } from "ol/geom";
import Event from "ol/events/Event";

describe("Modify interactions", () => {
  let map: Map;
  let tempFeature: Feature;
  let vectorLayer: VectorLayer;
  let setIsSelected: (isSelected: boolean) => void;
  let setEnableSelect: (enableSelect: boolean) => void;
  let setEnableModify: (enableModify: boolean) => void;

  beforeEach(() => {
    map = new Map();
    tempFeature = new Feature(new Point([0, 0]));
    vectorLayer = new VectorLayer({ source: new VectorSource() });
    vectorLayer.getSource()?.addFeature(tempFeature);
    setIsSelected = vi.fn();
    setEnableSelect = vi.fn();
    setEnableModify = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should add modify interaction to the map", () => {
    renderHook(() =>
      ModifyInteractions({
        map,
        tempFeature,
        vectorLayer,
        setIsSelected,
        setEnableSelect,
        setEnableModify,
      }),
    );

    const modifyInteraction = map
      .getInteractions()
      .getArray()
      .find((interaction) => interaction instanceof Modify);

    expect(modifyInteraction).toBeDefined();
  });

  it("should remove tempFeature from the vectorLayer and add tempFeature to the vectorLayer", () => {
    const source = vectorLayer.getSource();
    const sourceRemove = vi.spyOn(source as VectorSource, "removeFeature");
    expect(source?.getFeatures().length).toBe(1);
    renderHook(() => {
      ModifyInteractions({
        map,
        tempFeature,
        vectorLayer,
        setIsSelected,
        setEnableSelect,
        setEnableModify,
      });
    });

    const modifyInteraction = map
      .getInteractions()
      .getArray()
      .find((interaction) => interaction instanceof Modify);

    expect(modifyInteraction).toBeDefined();
    const sourceModify = modifyInteraction?.get("mySource") as VectorSource;
    expect(sourceModify.getFeatures().length).toBe(1);

    expect(sourceRemove).toHaveBeenCalled();

    expect(source?.getFeatures().length).toBe(0);
  });

  it("should add tempFeature back to the source after dbl click", () => {
    const source = vectorLayer.getSource();
    expect(source?.getFeatures().length).toBe(1);
    renderHook(() => {
      ModifyInteractions({
        map,
        tempFeature,
        vectorLayer,
        setIsSelected,
        setEnableSelect,
        setEnableModify,
      });
    });

    const modifyInteraction = map
      .getInteractions()
      .getArray()
      .find((interaction) => interaction instanceof Modify) as Modify;

    expect(modifyInteraction).toBeDefined();
    const sourceModify = modifyInteraction?.get("mySource") as VectorSource;
    expect(sourceModify.getFeatures().length).toBe(1);

    act(() => {
      modifyInteraction?.dispatchEvent(new Event("dblclick"));
    });
    expect(sourceModify.getFeatures().length).toBe(0);
    expect(source?.getFeatures().length).toBe(1);
  });
});
