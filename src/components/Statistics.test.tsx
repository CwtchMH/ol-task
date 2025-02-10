import {
  handleMinInteraction,
  handleMaxInteraction,
  handleSumInteractions,
} from "./Statistics";
import { describe, expect, it } from "@jest/globals";

describe("Statistics", () => {
  it("should return the sum of interactions", () => {
    const modifyQuantity = 1;
    const drawQuantity = 2;
    const translateQuantity = 3;
    const sum = handleSumInteractions(
      modifyQuantity,
      drawQuantity,
      translateQuantity,
    );
    expect(sum).toBe(6);
  });

  it("should return the minimum interaction", () => {
    const featureQuantity = 1;
    const modifyQuantity = 2;
    const drawQuantity = 3;
    const translateQuantity = 4;
    const min = handleMinInteraction(
      featureQuantity,
      modifyQuantity,
      drawQuantity,
      translateQuantity,
    );
    expect(min).toBe(1);
  });

  it("should return the maximum interaction", () => {
    const featureQuantity = 1;
    const modifyQuantity = 2;
    const drawQuantity = 3;
    const translateQuantity = 4;
    const max = handleMaxInteraction(
      featureQuantity,
      modifyQuantity,
      drawQuantity,
      translateQuantity,
    );
    expect(max).toBe(4);
  });
});
