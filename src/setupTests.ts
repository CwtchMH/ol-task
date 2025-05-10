import * as matchers from "@testing-library/jest-dom/matchers";
import { expect, vi } from "vitest";
import "@testing-library/jest-dom";
import "@vitest/web-worker";

expect.extend(matchers);

// Polyfill URL.createObjectURL if it's not available
if (typeof URL.createObjectURL !== "function") {
  URL.createObjectURL = () => {
    // Return a dummy URL string.
    return "blob:dummy-url";
  };
}

// Mock the ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Stub the global ResizeObserver
vi.stubGlobal("ResizeObserver", ResizeObserverMock);
