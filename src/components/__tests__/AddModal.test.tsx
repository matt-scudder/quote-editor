import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddModal from "../AddModal";
import { vi } from "vitest";

describe("AddModal", () => {
  it("should focus the input field when the modal opens", () => {
    render(
      <AddModal
        handleClose={() => {}}
        handleSave={() => {}}
      />
    );
    const input = screen.getByLabelText(/quote text/i);
    expect(document.activeElement).toBe(input);
  });

  it("should call handleSave when the form is submitted", async () => {
    const handleSave = vi.fn();
    render(
      <AddModal
        handleClose={() => {}}
        handleSave={handleSave}
      />
    );
    const input = screen.getByLabelText(/quote text/i);
    await userEvent.type(input, "Test Quote");
    const saveButton = screen.getByRole("button", { name: /save/i });
    await userEvent.click(saveButton);
    expect(handleSave).toHaveBeenCalled();
  });

  it("should call handleClose when the cancel button is clicked", async () => {
    const handleClose = vi.fn();
    render(
      <AddModal
        handleClose={handleClose}
        handleSave={() => {}}
      />
    );
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelButton);
    expect(handleClose).toHaveBeenCalled();
  });
});
