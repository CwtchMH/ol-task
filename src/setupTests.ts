import * as matchers from "@testing-library/jest-dom/matchers";
import { expect } from "vitest";
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
