import { describe, it, expect } from "vitest";
import { formatDateTime } from "./format";

describe("formatDateTime", () => {
  it("formats a valid ISO datetime with two-digit values (happy path)", () => {
    // Arrange
    const input = "2025-12-31T13:45:00";
    // Act
    const result = formatDateTime(input);
    // Assert
    expect(result).toBe("31/12/2025 13:45");
  });

  it("pads single-digit day, month, hours and minutes (edge case)", () => {
    // Arrange
    const input = "2025-07-05T09:05:00";
    // Act
    const result = formatDateTime(input);
    // Assert
    expect(result).toBe("05/07/2025 09:05");
  });

  it("pads zero hours and minutes at midnight (edge case)", () => {
    // Arrange
    const input = "2025-01-01T00:00:00";
    // Act
    const result = formatDateTime(input);
    // Assert
    expect(result).toBe("01/01/2025 00:00");
  });

  it("truncates seconds and keeps the minute part (edge case)", () => {
    // Arrange
    const input = "2025-07-14T23:59:59";
    // Act
    const result = formatDateTime(input);
    // Assert
    expect(result).toBe("14/07/2025 23:59");
  });

  it("handles a leap day (edge case)", () => {
    // Arrange
    const input = "2024-02-29T08:15:00";
    // Act
    const result = formatDateTime(input);
    // Assert
    expect(result).toBe("29/02/2024 08:15");
  });

  it("handles a far-future year (edge case)", () => {
    // Arrange
    const input = "9999-12-31T23:59:00";
    // Act
    const result = formatDateTime(input);
    // Assert
    expect(result).toBe("31/12/9999 23:59");
  });

  it("does not pad years below 1000 (edge case)", () => {
    // Arrange
    const input = "0001-01-01T00:00:00";
    // Act
    const result = formatDateTime(input);
    // Assert
    expect(result).toBe("01/01/1 00:00");
  });

  it("returns NaN values for an invalid date string (edge case)", () => {
    // Arrange
    const input = "not-a-date";
    // Act
    const result = formatDateTime(input);
    // Assert
    expect(result).toBe("NaN/NaN/NaN NaN:NaN");
  });

  it("returns NaN values for an empty string (edge case)", () => {
    // Arrange
    const input = "";
    // Act
    const result = formatDateTime(input);
    // Assert
    expect(result).toBe("NaN/NaN/NaN NaN:NaN");
  });

  it("formats an ISO datetime with a timezone offset (edge case)", () => {
    // Arrange
    const input = "2025-07-14T12:30:00+07:00";
    // Act
    const result = formatDateTime(input);
    // Assert
    expect(result).toBe("14/07/2025 12:30");
  });
});
