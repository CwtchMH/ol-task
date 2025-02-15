// src/__tests__/MapWrapper.test.tsx
import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MapWrapper } from "../components/MapWrapper";
import { DataProvider } from "../context/DataProvider";
import { MapProvider } from "../context/MapProvider";
import { TypeProvider } from "../context/TypeProvider";

describe("Testing MapWrapper component", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render MapWrapper component", () => {
    render(
      <DataProvider>
        <MapProvider>
          <TypeProvider>
            <MapWrapper />
          </TypeProvider>
        </MapProvider>
      </DataProvider>,
    );

    const mapElement = screen.getByTestId("map");
    expect(mapElement).toBeInTheDocument();
    expect(mapElement).toHaveStyle("height: 100vh");
  });
});
