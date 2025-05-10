import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MapWrapper } from "../components/MapWrapper";
import { DataProvider } from "../context/DataProvider";
import { MapProvider } from "../context/MapProvider";
import { TypeProvider } from "../context/TypeProvider";
import VectorLayer from "ol/layer/Vector";
import Map from "ol/Map";
import Draw from "ol/interaction/Draw";
import Select from "ol/interaction/Select";
import Modify from "ol/interaction/Modify";
import Feature from "ol/Feature";
import VectorSource from "ol/source/Vector";
import Translate from "ol/interaction/Translate";

describe("Testing MapWrapper component", () => {
  // Helper function to set up the test environment
  const setup = ({
    enableDraw = false,
    enableSelect = false,
    typeGeometry = "Polygon",
    typeInteraction = "",
    isSelected = false,
    tempFeature = null,
  }: {
    enableDraw?: boolean;
    enableSelect?: boolean;
    typeGeometry?: string;
    typeInteraction?: string;
    isSelected?: boolean;
    tempFeature?: Feature | null;
  }) => {
    const map = new Map();
    const vectorLayer = new VectorLayer({
      source: new VectorSource(),
    });
    const mapRef = { current: document.createElement("div") };
    const setIsSelected = vi.fn();
    const setTempFeature = vi.fn();
    const setEnableSelect = vi.fn();
    const setEnableModify = vi.fn();
    const setEnableTranslate = vi.fn();

    render(
      <DataProvider>
        <MapProvider>
          <TypeProvider>
            <MapWrapper
              enableDraw={enableDraw}
              enableSelect={enableSelect}
              typeGeometry={typeGeometry}
              map={map}
              vectorLayer={vectorLayer}
              mapRef={mapRef}
              typeInteraction={typeInteraction}
              isSelected={isSelected}
              setIsSelected={setIsSelected}
              tempFeature={tempFeature}
              setTempFeature={setTempFeature}
              setEnableSelect={setEnableSelect}
              setEnableModify={setEnableModify}
              setEnableTranslate={setEnableTranslate}
            />
          </TypeProvider>
        </MapProvider>
      </DataProvider>,
    );

    return {
      map,
      vectorLayer,
      setIsSelected,
      setTempFeature,
    };
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render MapWrapper component", () => {
    setup({});
    const mapElement = screen.getByTestId("map");
    expect(mapElement).toBeInTheDocument();
    expect(mapElement).toHaveStyle("height: 100vh");
  });

  it("should render DrawInteractions component", () => {
    const { map } = setup({ enableDraw: true });
    const drawInteractions = map
      .getInteractions()
      .getArray()
      .find((interaction) => interaction instanceof Draw);
    expect(drawInteractions).toBeDefined();
  });

  it("should render SelectInteractions component", () => {
    const { map } = setup({ enableSelect: true });
    const selectInteractions = map
      .getInteractions()
      .getArray()
      .find((interaction) => interaction instanceof Select);
    expect(selectInteractions).toBeDefined();
  });

  it("should render ModifyInteractions component", () => {
    const tempFeature = new Feature();
    const { map } = setup({
      typeInteraction: "Modify",
      isSelected: true,
      tempFeature,
    });
    const modifyInteractions = map
      .getInteractions()
      .getArray()
      .find((interaction) => interaction instanceof Modify);
    expect(modifyInteractions).toBeDefined();
  });

  it("should render TranslateInteractions component", () => {
    const tempFeature = new Feature();
    const { map } = setup({
      typeInteraction: "Translate",
      isSelected: true,
      tempFeature,
    });
    const translateInteractions = map
      .getInteractions()
      .getArray()
      .find((interaction) => interaction instanceof Translate);
    expect(translateInteractions).toBeDefined();
  });
});
