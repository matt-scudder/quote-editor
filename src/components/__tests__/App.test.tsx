import { render, screen } from "@testing-library/react";
import App from "../../App";
import { describe, it, expect } from "vitest";
import '@testing-library/jest-dom';

describe("App", () => {
  it("renders the API selection dropdown when no tokens are provided", () => {
    render(<App />);
    // The label is 'Select API:' and the select has id 'apiSelect', so we can use getByLabelText
    expect(screen.getByLabelText(/select api/i)).toBeInTheDocument();
  });
});
