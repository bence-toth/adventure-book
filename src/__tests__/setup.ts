import "@testing-library/jest-dom";
import { beforeEach } from "vitest";
import "fake-indexeddb/auto";

// Create a simple in-memory localStorage implementation for tests
class LocalStorageMock {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

// Mock localStorage for tests with a real implementation
if (typeof window !== "undefined") {
  Object.defineProperty(window, "localStorage", {
    value: new LocalStorageMock(),
    writable: true,
  });
}

// Suppress expected console warnings in tests
const originalConsoleWarn = console.warn;

// Mock console.warn to filter out expected test warnings
console.warn = (...args: unknown[]) => {
  const message = String(args[0]);

  // Filter out expected warnings in tests
  if (
    message.includes("Failed to get progress data from localStorage:") ||
    message.includes("Failed to save progress data to localStorage:")
  ) {
    return;
  }

  // Call original for unexpected warnings
  originalConsoleWarn(...args);
};

// Clear localStorage and mocks before each test
beforeEach(async () => {
  localStorage.clear();
  // Note: IndexedDB is NOT cleared here to allow test setup to persist
  // Individual test files should clear IndexedDB in their own beforeEach if needed
});
