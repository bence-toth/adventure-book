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
Object.defineProperty(window, "localStorage", {
  value: new LocalStorageMock(),
  writable: true,
});

// Clear localStorage before each test
beforeEach(() => {
  localStorage.clear();
});
