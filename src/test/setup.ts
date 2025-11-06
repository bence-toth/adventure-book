import "@testing-library/jest-dom";
import { beforeEach, vi } from "vitest";

// Mock localStorage for tests
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

// Clear localStorage before each test
beforeEach(() => {
  vi.mocked(localStorage.getItem).mockReturnValue(null);
  vi.clearAllMocks();
});
