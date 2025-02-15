// src/__tests__/MapWrapper.test.tsx
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
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render MapWrapper component", () => {
    const enableDraw = false;
    const enableSelect = false;
    const typeGeometry = "Polygon";
    const map = new Map();
    const vectorLayer = new VectorLayer();
    const mapRef = { current: document.createElement("div") };
    const typeInteraction = "";
    const isSelected = false;
    const setIsSelected = vi.fn();
    const tempFeature = null;
    const setTempFeature = vi.fn();
    render(
      <DataProvider>
        <MapProvider>
          <TypeProvider>
            <MapWrapper
              enableDraw={enableDraw}
              enableSelect={enableSelect}
              typeGeometry={typeGeometry}
              map={map!}
              vectorLayer={vectorLayer}
              mapRef={mapRef}
              typeInteraction={typeInteraction}
              isSelected={isSelected}
              setIsSelected={setIsSelected}
              tempFeature={tempFeature}
              setTempFeature={setTempFeature}
            />
          </TypeProvider>
        </MapProvider>
      </DataProvider>,
    );

    const mapElement = screen.getByTestId("map");
    expect(mapElement).toBeInTheDocument();
    expect(mapElement).toHaveStyle("height: 100vh");
  });

  it("should render DrawInteractions component", () => {
    const enableDraw = true;
    const enableSelect = false;
    const typeGeometry = "Polygon";
    const map = new Map();
    const vectorLayer = new VectorLayer();
    const mapRef = { current: document.createElement("div") };
    const typeInteraction = "";
    const isSelected = false;
    const setIsSelected = vi.fn();
    const tempFeature = null;
    const setTempFeature = vi.fn();
    render(
      <DataProvider>
        <MapProvider>
          <TypeProvider>
            <MapWrapper
              enableDraw={enableDraw}
              enableSelect={enableSelect}
              typeGeometry={typeGeometry}
              map={map!}
              vectorLayer={vectorLayer}
              mapRef={mapRef}
              typeInteraction={typeInteraction}
              isSelected={isSelected}
              setIsSelected={setIsSelected}
              tempFeature={tempFeature}
              setTempFeature={setTempFeature}
            />
          </TypeProvider>
        </MapProvider>
      </DataProvider>,
    );

    const drawInteractions = map
      .getInteractions()
      .getArray()
      .find((interaction) => interaction instanceof Draw);

    expect(drawInteractions).toBeDefined();
  });

  it("should render SelectInteractions component", () => {
    const enableDraw = false;
    const enableSelect = true;
    const typeGeometry = "Polygon";
    const map = new Map();
    const vectorLayer = new VectorLayer();
    const mapRef = { current: document.createElement("div") };
    const typeInteraction = "";
    const isSelected = false;
    const setIsSelected = vi.fn();
    const tempFeature = null;
    const setTempFeature = vi.fn();
    render(
      <DataProvider>
        <MapProvider>
          <TypeProvider>
            <MapWrapper
              enableDraw={enableDraw}
              enableSelect={enableSelect}
              typeGeometry={typeGeometry}
              map={map!}
              vectorLayer={vectorLayer}
              mapRef={mapRef}
              typeInteraction={typeInteraction}
              isSelected={isSelected}
              setIsSelected={setIsSelected}
              tempFeature={tempFeature}
              setTempFeature={setTempFeature}
            />
          </TypeProvider>
        </MapProvider>
      </DataProvider>,
    );

    const selectInteractions = map
      .getInteractions()
      .getArray()
      .find((interaction) => interaction instanceof Select);

    expect(selectInteractions).toBeDefined();
  });

  it("should render ModifyInteractions component", () => {
    const enableDraw = false;
    const enableSelect = false;
    const typeGeometry = "Polygon";
    const map = new Map();
    const source = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: source,
    });
    const mapRef = { current: document.createElement("div") };
    const typeInteraction = "Modify";
    const isSelected = true;
    const setIsSelected = vi.fn();
    const tempFeature = new Feature();
    const setTempFeature = vi.fn();
    render(
      <DataProvider>
        <MapProvider>
          <TypeProvider>
            <MapWrapper
              enableDraw={enableDraw}
              enableSelect={enableSelect}
              typeGeometry={typeGeometry}
              map={map!}
              vectorLayer={vectorLayer}
              mapRef={mapRef}
              typeInteraction={typeInteraction}
              isSelected={isSelected}
              setIsSelected={setIsSelected}
              tempFeature={tempFeature}
              setTempFeature={setTempFeature}
            />
          </TypeProvider>
        </MapProvider>
      </DataProvider>,
    );

    const modifyInteractions = map
      .getInteractions()
      .getArray()
      .find((interaction) => interaction instanceof Modify);

    expect(modifyInteractions).toBeDefined();
  });
  it("should render TranslateInteractions component", () => {
    const enableDraw = false;
    const enableSelect = false;
    const typeGeometry = "Polygon";
    const map = new Map();
    const source = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: source,
    });
    const mapRef = { current: document.createElement("div") };
    const typeInteraction = "Translate";
    const isSelected = true;
    const setIsSelected = vi.fn();
    const tempFeature = new Feature();
    const setTempFeature = vi.fn();
    render(
      <DataProvider>
        <MapProvider>
          <TypeProvider>
            <MapWrapper
              enableDraw={enableDraw}
              enableSelect={enableSelect}
              typeGeometry={typeGeometry}
              map={map!}
              vectorLayer={vectorLayer}
              mapRef={mapRef}
              typeInteraction={typeInteraction}
              isSelected={isSelected}
              setIsSelected={setIsSelected}
              tempFeature={tempFeature}
              setTempFeature={setTempFeature}
            />
          </TypeProvider>
        </MapProvider>
      </DataProvider>,
    );

    const translateInteractions = map
      .getInteractions()
      .getArray()
      .find((interaction) => interaction instanceof Translate);

    expect(translateInteractions).toBeDefined();
  });
});
