import "@testing-library/jest-dom";
import { beforeEach, vi } from "vitest";
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
Object.defineProperty(window, "localStorage", {
  value: new LocalStorageMock(),
  writable: true,
});

// Suppress expected console warnings and errors in tests
// Save original methods
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Mock console methods to filter out expected test errors
console.error = (...args: unknown[]) => {
  const message = String(args[0]);

  // Filter out expected error messages that are intentionally triggered in tests
  if (
    message.includes("Error loading stories:") ||
    message.includes("Error deleting story:") ||
    message.includes("Error creating story:")
  ) {
    return;
  }

  // Call original for unexpected errors
  originalConsoleError(...args);
};

console.warn = (...args: unknown[]) => {
  const message = String(args[0]);

  // Filter out expected localStorage warnings in tests
  if (
    message.includes("Failed to get progress data from localStorage:") ||
    message.includes("Failed to save progress data to localStorage:") ||
    message.includes("Failed to save passage ID to localStorage:") ||
    message.includes("Failed to get passage ID from localStorage:") ||
    message.includes("Failed to clear passage ID from localStorage:") ||
    message.includes("Failed to save inventory to localStorage:") ||
    message.includes("Failed to get inventory from localStorage:") ||
    message.includes("Failed to clear inventory from localStorage:")
  ) {
    return;
  }

  // Call original for unexpected warnings
  originalConsoleWarn(...args);
};

// Clear localStorage before each test
beforeEach(() => {
  localStorage.clear();
});
