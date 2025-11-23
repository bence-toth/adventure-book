# Agent Guidelines for Adventure Book

This document provides guidance for AI agents working with the Adventure Book codebase—a TypeScript React application for creating interactive choose-your-own-adventure stories.

## Project Overview

Adventure Book is a low-code tool that separates content creation from implementation through YAML-based adventure authoring. Writers can create interactive narratives without touching code, while the application provides a robust, type-safe runtime for adventure execution.

**Core Value Proposition**: Enable non-technical writers to create engaging interactive stories through declarative YAML while maintaining code quality, performance, and accessibility.

## Development Principles

### Non-Negotiables

- **Test-Driven Development**: All features must have comprehensive test coverage. Write tests first, then implement functionality.
- **Type Safety**: Leverage TypeScript's type system aggressively. No `any` types in production code.
- **Pure Functions**: Prefer stateless, predictable functions with clear inputs and outputs.
- **Declarative Style**: Code should express _what_ should happen, not _how_.
- **Simplicity**: Choose the simplest solution that works. Avoid over-engineering.

### Code Quality Standards

- **Immutability**: Prefer immutable data structures and transformations
- **Separation of Concerns**: Keep data, presentation, and business logic separated
- **Accessibility**: Ensure all UI components are accessible and semantic
- **Error Boundaries**: Handle errors gracefully with meaningful user feedback
- **Performance**: Optimize for user experience, not premature optimization

## Architecture Patterns

### Data Flow Architecture

```
YAML Adventure Files → Parser → Validation → Type-Safe Objects → React Components → User Interface
```

**Key Insight**: The application treats adventure content as data that flows through a pipeline of transformations, each adding validation and structure.

### Component Hierarchy

- **App**: Route management and error boundaries
- **Introduction/Passage**: Presentational components consuming adventure data
- **ErrorBoundary**: Centralized error handling for data loading failures
- **Adventure System**: Pure functions for parsing, validation, and data access

### State Management Philosophy

- **Minimal State**: Use React's built-in state management; avoid external state libraries
- **Persistent State**: localStorage for user progress; everything else is derived from adventure data
- **Unidirectional Flow**: Data flows down, events flow up

## Testing Strategy

### Testing Hierarchy (in order of importance)

1. **Integration Tests**: User journeys and component interactions
2. **Component Tests**: Behavior and rendering of individual components
3. **Unit Tests**: Pure functions, parsers, validators
4. **Edge Cases**: Error handling and validation failures

### Testing Patterns

```typescript
// Good: Test behavior, not implementation
it("navigates to next passage when choice is clicked", () => {
  render(<Passage />);
  fireEvent.click(screen.getByText("Go to chapter 2"));
  expect(mockNavigate).toHaveBeenCalledWith("/passage/2");
});

// Avoid: Testing internal state or implementation details
```

**Key Principle**: Tests should mirror how users interact with the application. Use semantic queries (`getByRole`, `getByText`) over test IDs when possible.

## Adventure Data System

### YAML-to-TypeScript Pipeline

The adventure system transforms YAML content through several stages:

1. **Raw Parsing**: YAML string → JavaScript object
2. **Validation**: Structure and content validation with clear error messages
3. **Processing**: Multi-line text → paragraph arrays, reference resolution
4. **Type Casting**: Runtime validation → TypeScript interfaces

### Key Interfaces

```typescript
// Raw YAML structure (input)
interface RawAdventure {
  metadata: { title: string; author: string; version: string };
  intro: { text: string; action: string };
  passages: Record<number, RawPassage>;
}

// Processed structure (output)
interface Adventure {
  metadata: { title: string; author: string; version: string };
  intro: { paragraphs: string[]; action: string };
  passages: Record<number, Passage>;
}
```

### Content Validation Principles

- **Fail Fast**: Validate structure early in the parsing pipeline
- **Clear Messages**: Provide specific, actionable error messages
- **Reference Integrity**: Validate that all `goto` references point to valid passages
- **Content Rules**: Enforce adventure logic (endings can't have choices, etc.)

## Adventure Content Separation

### Critical Design Principle: Content Independence

**The most important architectural constraint**: All application code must be completely decoupled from the specific content and structure of any individual adventure. The tool's primary purpose is to enable authors to test their stories, which means adventure content will change frequently and unpredictably.

### Separation Requirements

- **No Hard-Coded References**: Never reference specific passage IDs, adventure titles, or content text in application code
- **Structure Agnostic**: The system must work with any valid adventure structure (linear, branching, complex graphs)
- **Content Agnostic**: UI components must render any valid content without modification
- **Test Independence**: All tests must work regardless of the actual adventure content

### Implementation Strategies

#### Mock-Based Testing

```typescript
// Good: Use mock data that doesn't depend on actual adventure content
const mockPassage = {
  paragraphs: ["Test paragraph 1", "Test paragraph 2"],
  choices: [
    { text: "Test choice A", goto: 2 },
    { text: "Test choice B", goto: 3 },
  ],
};

// Avoid: Testing with actual adventure content
const actualPassage = getPassage(1); // Breaks when adventure changes
```

#### Dynamic Content Handling

```typescript
// Good: Generic rendering that works with any content
{
  passage.paragraphs.map((paragraph, index) => (
    <p key={index} data-testid={`passage-paragraph-${index}`}>
      {paragraph}
    </p>
  ));
}

// Avoid: Hardcoded expectations about content
<p>You are in the dark forest...</p>; // Breaks when adventure changes
```

#### Flexible Navigation

```typescript
// Good: Navigation based on data structure
const handleChoiceClick = (targetPassageId: number) => {
  navigate(`/passage/${targetPassageId}`);
};

// Avoid: Hardcoded passage flows
if (currentPassageId === 1) navigate("/passage/2"); // Brittle
```

### Testing Strategy for Content Independence

#### Component Testing Patterns

- **Use Generated Mock Data**: Create mock stories programmatically rather than copying real content
- **Test Edge Cases**: Empty passages, single choices, multiple endings
- **Validate Rendering Logic**: Ensure components handle any valid data structure
- **Mock External Dependencies**: Always mock `adventureLoader` to provide predictable test data

#### Integration Testing Approach

- **User Flow Testing**: Test navigation patterns without depending on specific adventure paths
- **Error Boundary Testing**: Verify error handling with invalid or missing content
- **State Management Testing**: Ensure persistence works regardless of adventure structure

### Adventure Loader Architecture

The adventure loader acts as the crucial abstraction layer:

```typescript
// Good: Abstract interface that works with any adventure
interface AdventureLoader {
  loadAdventure(): Adventure;
  getPassage(id: number): Passage | undefined;
  introduction: IntroductionContent;
}

// The actual adventure content is an implementation detail
```

### Content Change Resilience

#### Graceful Degradation

- **Missing Passages**: Show helpful error messages with navigation options
- **Broken References**: Validate and report `goto` target issues
- **Invalid Structure**: Catch parsing errors and guide users to fix content

#### Development Workflow

1. **Adventure Changes Should Never Break Tests**: If a test fails due to adventure content changes, the test is wrong
2. **Component Behavior Is Constant**: UI behavior remains consistent regardless of adventure content
3. **Validation Is Structural**: Validate adventure structure and format, not specific content values

### Example: Content-Independent Implementation

```typescript
// Content-dependent (WRONG)
it("shows the forest passage correctly", () => {
  render(<Passage />);
  expect(screen.getByText("dark forest")).toBeInTheDocument();
});

// Content-independent (CORRECT)
it("renders passage paragraphs correctly", () => {
  const mockPassage = createMockPassage([
    "First paragraph",
    "Second paragraph",
  ]);

  vi.mocked(getPassage).mockReturnValue(mockPassage);

  render(<Passage />);

  expect(screen.getByTestId("passage-paragraph-0")).toBeInTheDocument();
  expect(screen.getByTestId("passage-paragraph-1")).toBeInTheDocument();
});
```

This separation ensures that authors can freely modify their adventure content, add new passages, change narrative flows, and experiment with different structures without breaking the application or its tests.

## Component Development Patterns

### Component Structure

```typescript
// Preferred component pattern
export const ComponentName = () => {
  // 1. Hooks and state
  const navigate = useNavigate();
  const { data, error } = useAdventureData();

  // 2. Event handlers (pure functions when possible)
  const handleAction = useCallback(
    (id: number) => {
      navigate(`/passage/${id}`);
    },
    [navigate]
  );

  // 3. Early returns for loading/error states
  if (error) return <ErrorDisplay error={error} />;
  if (!data) return <LoadingState />;

  // 4. Render logic
  return <div className="component-name">{/* JSX */}</div>;
};
```

### CSS Organization

- **Component-Scoped**: Each component has its own CSS file
- **CSS Variables**: Use design tokens for consistency
- **Semantic Classes**: Class names reflect purpose, not appearance
- **Responsive**: Mobile-first design with progressive enhancement

## Error Handling Philosophy

### Error Categories

1. **Parsing Errors**: Malformed YAML structure
2. **Validation Errors**: Invalid adventure content or references
3. **Runtime Errors**: Component failures or navigation issues
4. **User Errors**: Invalid URLs or missing passages

### Error Handling Strategy

- **Error Boundaries**: Catch and display parsing/validation errors
- **Graceful Degradation**: Show meaningful error messages with recovery options
- **Development vs Production**: More detailed errors in development
- **User-Focused Messages**: Explain what went wrong and how to fix it

## Development Workflow

### Feature Development Cycle

1. **Understand Requirements**: What adventure feature or user need are we addressing?
2. **Write Tests**: Define expected behavior through tests
3. **Implement Incrementally**: Build functionality step by step
4. **Validate**: Run tests, linting, and type checking
5. **Manual Testing**: Test user flows in the browser
6. **Refactor**: Simplify and optimize the implementation

### Code Review Guidelines

- **Test Coverage**: Ensure new functionality is well-tested
- **Type Safety**: Verify TypeScript usage follows best practices
- **Accessibility**: Check that UI changes maintain accessibility
- **Performance**: Consider impact on user experience
- **Documentation**: Update relevant documentation, avoid creating new documentation files

## Extension Points

### Adding New Passage Types

The adventure system is designed for extension while maintaining content independence:

1. Extend the `Passage` interface in `types.ts`
2. Update validation logic in `adventureParser.ts`
3. Modify UI components to handle the new type generically
4. Add tests using mock data, never actual adventure content

### Integrating External Systems

- **Analytics**: Add event tracking through pure functions that work with any adventure structure
- **Content Management**: Replace YAML loading with API calls while maintaining the same interfaces
- **Internationalization**: Extend metadata to support multiple languages without changing core logic
- **Themes**: Expand CSS variables for customization independent of adventure content

### Key Constraint for Extensions

All extensions must preserve content independence. New features should work with any valid adventure structure without requiring changes to existing adventure files or breaking when adventure content changes.

## Common Development Tasks

### Adding New Adventure Features

1. **Define TypeScript Interface**: Start with type definitions in `src/data/types.ts`
2. **Update Parser**: Add validation logic in `src/data/adventureParser.ts`
3. **Write Content-Independent Tests**: Test parsing, validation, and UI with mock data
4. **Implement Generic UI**: Create components that work with any valid content structure
5. **Integration Test**: Verify end-to-end functionality with generated test stories

### Debugging Adventure Issues

1. **Parser Errors**: Check `AdventureParser.validateAdventure()` output
2. **Missing Passages**: Verify `goto` references exist in passages
3. **Navigation Issues**: Check React Router paths and parameters
4. **Rendering Problems**: Inspect component props and state in dev tools
5. **Content Problems**: Use mock data to isolate application vs. content issues

### Safe Adventure Content Changes

Authors should be able to:

- Add, remove, or renumber passages freely
- Change all text content without breaking functionality
- Restructure narrative flows and choice graphs
- Add new endings or modify existing ones
- Update metadata (title, author, version) safely

None of these changes should require code modifications or break existing tests.

### Avoid These Patterns

- **Direct DOM Manipulation**: Use React's declarative approach
- **Mutating Props**: Always treat props as immutable
- **Side Effects in Render**: Keep renders pure
- **Testing Implementation Details**: Focus on user-visible behavior
- **Complex State Management**: Keep state simple and local
- **Content-Dependent Code**: Never hardcode adventure content, passage IDs, or specific narrative flows
- **Brittle Tests**: Avoid tests that break when adventure content changes

### Best Practices

- **Start Simple**: Build the minimum viable feature first
- **Write Tests Early**: Tests guide good design decisions
- **Use TypeScript**: Leverage the type system for safety and documentation
- **Think in Components**: Break complex UI into smaller, focused components
- **Optimize for Readability**: Code is read more often than written

## Getting Help

### Resources

- **README.md**: Setup, contributing guidelines, and project overview
- **Test Files**: Examples of testing patterns and component usage
- **TypeScript Definitions**: Understanding data structures and interfaces
- **Component Files**: Patterns for UI development and state management

### Debugging Checklist

1. Are all tests passing?
2. Is TypeScript compilation successful?
3. Are there any console errors or warnings?
4. Does the user flow work end-to-end?
5. Is the code accessible and semantic?

Remember: The goal is to enable writers to create compelling interactive stories through simple, powerful tools. Every code decision should support that mission while maintaining quality, performance, and developer experience.
