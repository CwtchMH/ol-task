import { renderHook, act } from "@testing-library/react-hooks";
import { Map } from "ol";
import VectorLayer from "ol/layer/Vector";
import Feature from "ol/Feature";
import VectorSource from "ol/source/Vector";
import TranslateInteractions from "../components/interactions/translateInteraction";
import { vi } from "vitest";
import Translate from "ol/interaction/Translate";
import { Point } from "ol/geom";
import Event from "ol/events/Event";

describe("TranslateInteractions", () => {
  let map: Map;
  let vectorLayer: VectorLayer;
  let tempFeature: Feature;
  let setIsSelected: (isSelected: boolean) => void;
  let setEnableSelect: (enableSelect: boolean) => void;
  let setEnableTranslate: (enableTranslate: boolean) => void;

  beforeEach(() => {
    map = new Map({});
    vectorLayer = new VectorLayer({
      source: new VectorSource(),
    });
    tempFeature = new Feature(new Point([0, 0]));
    vectorLayer.getSource()?.addFeature(tempFeature);
    setIsSelected = vi.fn();
    setEnableSelect = vi.fn();
    setEnableTranslate = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should add translate interaction to the map", () => {
    renderHook(() =>
      TranslateInteractions({
        map,
        tempFeature,
        vectorLayer,
        setIsSelected,
        setEnableSelect,
        setEnableTranslate,
      }),
    );

    const translateInteraction = map
      .getInteractions()
      .getArray()
      .find((interaction) => interaction instanceof Translate) as Translate;

    expect(translateInteraction).toBeDefined();
  });

  it("should handle double click correctly", () => {
    const source = vectorLayer.getSource();
    expect(source?.getFeatures().length).toBe(1);
    renderHook(() =>
      TranslateInteractions({
        map,
        vectorLayer,
        tempFeature,
        setIsSelected,
        setEnableSelect,
        setEnableTranslate,
      }),
    );

    const translateInteraction = map
      .getInteractions()
      .getArray()
      .find((interaction) => interaction instanceof Translate) as Translate;

    expect(translateInteraction).toBeDefined();
    const sourceTranslate = translateInteraction.get(
      "mySource",
    ) as VectorSource;
    expect(sourceTranslate.getFeatures().length).toBe(1);
    expect(source?.getFeatures().length).toBe(0);
    act(() => {
      map.dispatchEvent(new Event("dblclick"));
    });
    expect(source?.getFeatures().length).toBe(1);
    expect(sourceTranslate.getFeatures().length).toBe(0);
  });
});
