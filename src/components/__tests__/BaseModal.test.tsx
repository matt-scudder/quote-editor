import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import BaseModal from "../BaseModal";
import '@testing-library/jest-dom';

describe("BaseModal", () => {
  it("should call onClose when the Escape key is pressed", () => {
    const handleClose = vi.fn();
    render(
      <BaseModal onClose={handleClose}>
        <div>Modal Content</div>
      </BaseModal>
    );

    // The modal content itself might be focused, or the body.
    // We fire the event on the document to ensure it's caught.
    fireEvent.keyDown(document, { key: "Escape", code: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("should call onClose when the modal overlay (backdrop) is clicked", () => {
    const handleClose = vi.fn();
    render(
      <BaseModal onClose={handleClose}>
        <div>Modal Content</div>
      </BaseModal>
    );

    // The overlay is usually a div that's a direct child of the body or a portal root,
    // and it often has a specific role or test ID.
    // Assuming the BaseModal renders a backdrop div that can be targeted.
    // Let's assume the backdrop is the first child div of the modal's container,
    // or has a specific test id. For BaseModal, the structure is a div wrapping content.
    // The click should be on the outer div that acts as the backdrop.
    // BaseModal structure: <div (onClick for backdrop)> <div (content, stopPropagation)> ... </div> </div>
    // We need to get the backdrop element. Let's assume it has a test-id or is the parent of the content.
    // If BaseModal uses a specific data-testid for the backdrop, use that.
    // For now, let's assume the modal's direct container/wrapper is the backdrop.
    // A common pattern is that the modal itself is a div, and clicking it (if it's the backdrop) closes.
    // Let's get the modal by role="dialog" (if applicable) or a known container.
    // The BaseModal has an outer div with onClick.
    const modalBackdrop = screen.getByRole('dialog'); // Changed from getByTestId to getByRole
    fireEvent.click(modalBackdrop);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("should NOT call onClose when the modal content is clicked", () => {
    const handleClose = vi.fn();
    render(
      <BaseModal onClose={handleClose}>
        <div data-testid="modal-content-area">Modal Content</div>
      </BaseModal>
    );

    const modalContent = screen.getByTestId("modal-content-area");
    fireEvent.click(modalContent);
    expect(handleClose).not.toHaveBeenCalled();
  });

  it("should render children", () => {
    render(
      <BaseModal onClose={() => {}}>
        <div>Visible Content</div>
      </BaseModal>
    );
    expect(screen.getByText("Visible Content")).toBeInTheDocument();
  });
});
