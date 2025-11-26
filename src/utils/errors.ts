// Custom error classes for Adventure Book application.
// Each error class encapsulates a specific error scenario with a user-friendly message.
// These errors are caught by the ErrorBoundary component for display.

// Error thrown when an adventure cannot be loaded
export class AdventureLoadError extends Error {
  constructor(message = "Unable to load the adventure. Please try again.") {
    super(message);
    this.name = this.constructor.name;
  }
}

// Error thrown when an adventure is not found
export class AdventureNotFoundError extends Error {
  constructor(message = "Adventure not found.") {
    super(message);
    this.name = this.constructor.name;
  }
}

// Error thrown when a passage ID is invalid
export class InvalidPassageIdError extends Error {
  constructor(passageId: string) {
    super(
      `The passage ID "${passageId}" is not valid. Please use a valid number.`
    );
    this.name = this.constructor.name;
  }
}

// Error thrown when a passage is not found in the adventure
export class PassageNotFoundError extends Error {
  constructor(passageId: number) {
    super(`Passage #${passageId} does not exist in this adventure.`);
    this.name = this.constructor.name;
  }
}

// Error thrown when the adventure YAML cannot be parsed
export class AdventureParseError extends Error {
  constructor(
    message = "There was an error parsing the adventure file. The adventure format may be invalid."
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

// Error thrown when adventure validation fails
export class AdventureValidationError extends Error {
  constructor(
    message = "The adventure file contains validation errors and cannot be loaded."
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

// Error thrown when stories cannot be loaded from the database
export class StoriesLoadError extends Error {
  constructor(message = "Failed to load stories.") {
    super(message);
    this.name = this.constructor.name;
  }
}

// Error thrown when a story cannot be created
export class StoryCreateError extends Error {
  constructor(message = "Failed to create adventure.") {
    super(message);
    this.name = this.constructor.name;
  }
}

// Error thrown when a story cannot be deleted
export class StoryDeleteError extends Error {
  constructor(message = "Failed to delete adventure.") {
    super(message);
    this.name = this.constructor.name;
  }
}
