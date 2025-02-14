// src/__tests__/MapWrapper.test.tsx
import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MapWrapper } from "../components/MapWrapper";
import { useCombinedContext } from "../hooks/useCombinedContext";
import React from "react";

vi.mock("../hooks/useCombinedContext", () => ({
  useCombinedContext: vi.fn(),
}));

vi.mock("../components/interactions/drawInteraction", () => {
  return {
    default: () => {
      return (
        <div data-testid="draw-interaction-mock">Mock Draw Interaction</div>
      );
    },
  };
});

vi.mock("../components/interactions/selectInteraction", () => {
  return {
    default: () => {
      return (
        <div data-testid="select-interaction-mock">Mock Select Interaction</div>
      );
    },
  };
});

vi.mock("../components/interactions/modifyInteraction", () => {
  return {
    default: () => {
      return (
        <div data-testid="modify-interaction-mock">Mock Modify Interaction</div>
      );
    },
  };
});

vi.mock("../components/interactions/translateInteraction", () => {
  return {
    default: () => {
      return (
        <div data-testid="translate-interaction-mock">
          Mock Translate Interaction
        </div>
      );
    },
  };
});

describe("Testing MapWrapper component", () => {
  const mockSetTempFeature = vi.fn();
  const mockSetIsSelected = vi.fn();

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it("should render map", () => {
    (useCombinedContext as jest.Mock).mockReturnValue({
      enableDraw: false,
      enableSelect: false,
      typeGeometry: null,
      map: {},
      vectorLayer: {},
      mapRef: React.createRef(),
      typeInteraction: null,
      isSelected: false,
      setIsSelected: mockSetIsSelected,
      tempFeature: null,
      setTempFeature: mockSetTempFeature,
    });

    render(<MapWrapper />);

    const mapElement = screen.getByTestId("map");
    expect(mapElement).toBeInTheDocument();
    expect(mapElement).toHaveStyle("height: 100vh");
  });

  it("should render DrawInteractions component", () => {
    (useCombinedContext as jest.Mock).mockReturnValue({
      enableDraw: true,
      enableSelect: false,
      typeGeometry: "Point",
      map: {},
      vectorLayer: {},
      mapRef: React.createRef(),
      typeInteraction: null,
      isSelected: false,
      setIsSelected: mockSetIsSelected,
      tempFeature: null,
      setTempFeature: mockSetTempFeature,
    });

    render(<MapWrapper />);

    const drawInteraction = screen.getByTestId("draw-interaction-mock");
    expect(drawInteraction).toBeInTheDocument();
  });

  it("should render SelectInteractions component", () => {
    (useCombinedContext as jest.Mock).mockReturnValue({
      enableDraw: false,
      enableSelect: true,
      typeGeometry: "Point",
      map: {},
      vectorLayer: {},
      mapRef: React.createRef(),
      typeInteraction: null,
      isSelected: false,
      setIsSelected: mockSetIsSelected,
      tempFeature: null,
      setTempFeature: mockSetTempFeature,
    });

    render(<MapWrapper />);

    const selectInteraction = screen.getByTestId("select-interaction-mock");
    expect(selectInteraction).toBeInTheDocument();
  });

  it("should render ModifyInteractions component", () => {
    (useCombinedContext as jest.Mock).mockReturnValue({
      enableDraw: false,
      enableSelect: false,
      typeGeometry: "Point",
      map: {},
      vectorLayer: {},
      mapRef: React.createRef(),
      typeInteraction: "Modify",
      isSelected: true,
      setIsSelected: mockSetIsSelected,
      tempFeature: {},
      setTempFeature: mockSetTempFeature,
    });

    render(<MapWrapper />);

    const modifyInteraction = screen.getByTestId("modify-interaction-mock");
    expect(modifyInteraction).toBeInTheDocument();
  });

  it("should render TranslateInteractions component", () => {
    (useCombinedContext as jest.Mock).mockReturnValue({
      enableDraw: false,
      enableSelect: false,
      typeGeometry: "Point",
      map: {},
      vectorLayer: {},
      mapRef: React.createRef(),
      typeInteraction: "Translate",
      isSelected: true,
      setIsSelected: mockSetIsSelected,
      tempFeature: {},
      setTempFeature: mockSetTempFeature,
    });

    render(<MapWrapper />);

    const translateInteraction = screen.getByTestId(
      "translate-interaction-mock",
    );
    expect(translateInteraction).toBeInTheDocument();
  });
});
