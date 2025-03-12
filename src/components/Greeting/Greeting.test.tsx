import { render, screen } from "@testing-library/react";
import Greeting from "./Greeting";

test("renders translated text", () => {
  render(<Greeting />);
  expect(screen.getByText("hello")).toBeInTheDocument();
expect(1).toBe(1)
});
