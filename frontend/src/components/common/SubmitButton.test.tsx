import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SubmitButton from "./SubmitButton";

describe("SubmitButton", () => {
  it("renders the provided title", () => {
    // Arrange
    const title = "Lưu";
    // Act
    render(<SubmitButton title={title} />);
    // Assert
    expect(screen.getByRole("button", { name: title })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<SubmitButton title="Lưu" onClick={onClick} />);
    const button = screen.getByRole("button", { name: "Lưu" });
    // Act
    await user.click(button);
    // Assert
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not trigger onClick when disabled", async () => {
    // Arrange
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<SubmitButton title="Lưu" onClick={onClick} disabled />);
    const button = screen.getByRole("button", { name: "Lưu" });
    // Assert (initial state)
    expect(button).toBeDisabled();
    // Act
    await user.click(button);
    // Assert (behaviour)
    expect(onClick).not.toHaveBeenCalled();
  });

  it("is enabled when the disabled prop is not set (default)", () => {
    // Arrange
    render(<SubmitButton title="Lưu" />);
    const button = screen.getByRole("button", { name: "Lưu" });
    // Assert
    expect(button).toBeEnabled();
  });

  it("does not throw when clicked without an onClick handler (edge case)", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<SubmitButton title="Lưu" />);
    const button = screen.getByRole("button", { name: "Lưu" });
    // Act + Assert
    await expect(user.click(button)).resolves.toBeUndefined();
  });

  it("renders with type button to avoid form submission", () => {
    // Arrange
    render(<SubmitButton title="Lưu" />);
    const button = screen.getByRole("button", { name: "Lưu" });
    // Assert
    expect(button).toHaveAttribute("type", "button");
  });

  it("sets the disabled attribute on the DOM when disabled is true", () => {
    // Arrange
    render(<SubmitButton title="Lưu" disabled />);
    const button = screen.getByRole("button", { name: "Lưu" });
    // Assert
    expect(button).toHaveAttribute("disabled");
  });

  it("calls onClick once for every click", async () => {
    // Arrange
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<SubmitButton title="Lưu" onClick={onClick} />);
    const button = screen.getByRole("button", { name: "Lưu" });
    // Act
    await user.click(button);
    await user.click(button);
    // Assert
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("calls onClick with a click event", async () => {
    // Arrange
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<SubmitButton title="Lưu" onClick={onClick} />);
    const button = screen.getByRole("button", { name: "Lưu" });
    // Act
    await user.click(button);
    // Assert
    expect(onClick).toHaveBeenCalledWith(
      expect.objectContaining({ type: "click" }),
    );
  });

  it("updates behaviour when the disabled prop changes on rerender", async () => {
    // Arrange
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(<SubmitButton title="Lưu" onClick={onClick} />);
    const button = screen.getByRole("button", { name: "Lưu" });
    // Act (enabled)
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    // Act (rerender as disabled)
    rerender(<SubmitButton title="Lưu" onClick={onClick} disabled />);
    await user.click(screen.getByRole("button", { name: "Lưu" }));
    // Assert
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
