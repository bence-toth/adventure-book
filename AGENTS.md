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
- **AdventureManager**: Main interface for managing and testing adventures
- **TestAdventure**: Adventure playback and testing interface
- **ErrorBoundary**: Centralized error handling for data loading failures
- **Adventure System**: Pure functions for parsing, validation, and data access via IndexedDB

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
// Adventure metadata
interface AdventureMetadata {
  id: string; // Unique identifier
  title: string; // Adventure title
  author?: string; // Optional author name
  createdAt: number; // Timestamp
  updatedAt: number; // Last modified timestamp
}

// Passage structure
interface Passage {
  id: number; // Unique passage ID
  paragraphs: string[]; // Content paragraphs
  choices?: Choice[]; // Optional choices (endings have none)
  isEnding?: boolean; // Whether this is an ending
}

// Adventure structure (stored in IndexedDB)
interface Adventure {
  metadata: AdventureMetadata;
  passages: Record<number, Passage>;
  yamlContent: string; // Original YAML for editing
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

### Adventure Database Architecture

The application uses IndexedDB for persistent storage of adventures:

```typescript
// Database operations for adventure management
interface AdventureDatabase {
  saveAdventure(adventure: Adventure): Promise<void>;
  getAdventure(id: string): Promise<Adventure | undefined>;
  getAllAdventures(): Promise<Adventure[]>;
  deleteAdventure(id: string): Promise<void>;
}

// Context provides current adventure to components
const adventure = useAdventure(); // Returns Adventure | null
```

The actual adventure content is stored in IndexedDB and loaded via React Context.

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

### CSS Organization and Guidelines

#### Core Principles

- **Styled Components**: All styles are written using styled-components in separate `ComponentName.styles.ts` files
- **Component-Scoped**: Each component has its own `.styles.ts` file colocated with the component
- **Modern CSS**: Use modern CSS features (logical properties, container queries, color functions, etc.)
- **CSS Variables for Spacing/Sizing**: Never use hardcoded units (px, rem, em) - always use CSS variables from `index.css`
- **Color Helpers for Colors**: Never reference color CSS variables directly - use `getColor()` and `getInteractiveColor()` helper functions
- **Semantic Classes**: Class names reflect purpose, not appearance
- **Responsive**: Mobile-first design with progressive enhancement

#### File Structure

Each component should have a corresponding `.styles.ts` file:

```
ComponentName/
  ComponentName.tsx
  ComponentName.styles.ts
  __tests__/
```

Styled components are imported and used in the component file:

```typescript
import { StyledButton, IconWrapper } from "./Button.styles";
```

#### Color Helpers (from `src/utils/colorHelpers.ts`)

**CRITICAL**: Never reference color CSS variables directly. Always use the color helper functions.

**`getColor()`** - For non-interactive elements:

```typescript
import { getColor } from "@/utils/colorHelpers";

const Container = styled.div`
  background: ${getColor({ type: "background", variant: "neutral" })};
  color: ${getColor({ type: "foreground", variant: "neutral" })};
  border: 1px solid
    ${getColor({ type: "border", variant: "neutral", isSurface: true })};
  box-shadow: ${getColor({
    type: "shadow",
    variant: "neutral",
    isSurface: true,
  })};
`;
```

Parameters:

- `type`: "background" | "foreground" | "foreground-muted" | "border" | "shadow"
- `variant`: "neutral" | "primary" | "danger"
- `isSurface`: boolean (required for border/shadow, optional for background)
- `isElevated`: boolean (optional, for elevated surfaces)

**`getInteractiveColor()`** - For interactive elements with state:

```typescript
import { getInteractiveColor } from "@/utils/colorHelpers";

const Button = styled.button<{ $variant: "neutral" | "primary" | "danger" }>`
  background: ${(props) =>
    getInteractiveColor({
      variant: props.$variant,
      type: "background",
      state: "default",
    })};
  color: ${(props) =>
    getInteractiveColor({
      variant: props.$variant,
      type: "foreground",
      state: "default",
    })};

  &:hover {
    background: ${(props) =>
      getInteractiveColor({
        variant: props.$variant,
        type: "background",
        state: "hover",
      })};
  }
`;
```

Parameters:

- `variant`: "neutral" | "primary" | "danger"
- `type`: "background" | "foreground" | "border" | "outline"
- `state`: "default" | "hover" | "active" | "focus"

#### CSS Variable Categories (from `index.css`)

**Colors** - Use color helper functions instead of direct variable references:

- ❌ `var(--color-background-neutral)` - Don't use directly
- ✅ `getColor({ type: "background", variant: "neutral" })` - Use helper function

**Spacing** - Use space variables for all sizing:

- `--space-0-25`, `--space-0-5`, `--space-1` through `--space-5` - Consistent spacing scale
- Never use `px`, `rem`, or `em` directly

**Typography**:

- `--font-family-{type}` - display, monospace, default
- `--font-size-{size}` - sm, md, lg, xl
- `--line-height-{spacing}` - dense, normal, relaxed, loose

**Element Sizing**:

- `--size-{element}` - Pre-defined sizes for common elements (top-bar, sidebar, content, etc.)

**Borders**:

- `--border-width-{type}` - surface, interactive

**Animations**:

- `--duration-{speed}` - fast, medium, slow

**Shadows**:

- `--shadow-{type}-{variant}` - Pre-defined shadow utilities

#### Styling Best Practices

✅ **Use styled-components with CSS variables and color helpers**

```typescript
import styled from "styled-components";
import { getColor, getInteractiveColor } from "@/utils/colorHelpers";

const Container = styled.div`
  padding: var(--space-2);
  color: ${getColor({ type: "foreground", variant: "neutral" })};
  font-size: var(--font-size-md);
  border-width: var(--border-width-surface);
`;

const Button = styled.button<{ $variant: "neutral" | "primary" }>`
  background: ${(props) =>
    getInteractiveColor({
      variant: props.$variant,
      type: "background",
      state: "default",
    })};

  &:hover {
    background: ${(props) =>
      getInteractiveColor({
        variant: props.$variant,
        type: "background",
        state: "hover",
      })};
  }
`;
```

❌ **Never use hardcoded units**

```typescript
const Wrong = styled.div`
  padding: 16px; /* Wrong - use var(--space-2) */
  font-size: 1rem; /* Wrong - use var(--font-size-md) */
  border-width: 1px; /* Wrong - use var(--border-width-surface) */
`;
```

❌ **Never reference color variables directly**

```typescript
const Wrong = styled.button`
  /* Wrong - use getInteractiveColor() helper instead */
  background-color: var(--color-interactive-background-default-primary);
  color: var(--color-interactive-foreground-default-primary);
`;
```

❌ **Avoid italic text**

```typescript
const Text = styled.p`
  font-style: italic; /* Avoid - italic is generally not used in this project */
`;
```

✅ **Use modern CSS features**

```typescript
const Component = styled.div`
  /* Logical properties for internationalization */
  padding-inline: var(--space-2);
  margin-block-start: var(--space-3);

  /* Container queries when appropriate */
  container-type: inline-size;
`;
```

❌ **Never define new custom values in component styles**

```typescript
const Wrong = styled.div`
  --custom-size: 42px; /* Wrong - should be added to index.css if needed project-wide */
  padding: var(--custom-size);
`;
```

#### Color Utility Selection Guide

- **Neutral**: Default UI elements, text, backgrounds
- **Primary**: Main actions, highlights, brand elements (turquoise)
- **Danger**: Destructive actions, errors (red)
- **Info**: Informational content, non-critical alerts (blue)

Each variant has full state support (default, hover, active, focus) for interactive elements.

#### When CSS Variables Don't Exist

If a needed value doesn't exist in `index.css`:

1. Consider if the design needs adjustment to fit existing tokens
2. Only if absolutely necessary, propose adding a new variable to `index.css` in a separate change

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

### Automated Quality Checks

**ALWAYS run these commands when making changes:**

1. **Fix Lint Errors Automatically**: `npm run lint:fix` - Auto-fixes all ESLint, Stylelint, and Prettier issues
2. **Run Tests Non-Interactively**: `npm run test:run` - Runs all tests once without watch mode (no user interaction needed)
3. **Check for Type Errors**: `npm run test:types` - Verify TypeScript compilation

### Feature Development Cycle

1. **Understand Requirements**: What adventure feature or user need are we addressing?
2. **Write Tests**: Define expected behavior through tests
3. **Implement Incrementally**: Build functionality step by step
4. **Validate**: Run `npm run lint:fix`, `npm run test:types` and `npm run test:run`
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

## Development Scripts

### Core Development Commands

```bash
# Development server
npm run dev              # Start Vite dev server with HMR

# Building
npm run build            # Type check and build for production
npm run preview          # Preview production build locally
```

### Testing Commands

```bash
# Running tests
npm run test:run         # Run tests once (CI mode)
npm run test:coverage    # Generate test coverage report
npm run test:types       # Type check without emitting files
```

**Important**: Always use `npm run test:run` when running tests automatically or in scripts. This runs tests once without requiring user interaction (no need to press 'q' to quit).

### Linting and Code Quality

```bash
# Comprehensive linting
npm run lint             # Run ESLint and Stylelint checks, and unused code detection
npm run lint:fix         # Auto-fix all linting issues (ESLint + Stylelint)

# JavaScript/TypeScript linting
npm run lint:ts          # Check JS/TS code quality with ESLint
npm run lint:ts:fix      # Auto-fix ESLint issues

# CSS linting
npm run lint:styles      # Check CSS code quality with Stylelint
npm run lint:styles:fix  # Auto-fix Stylelint issues

# Detect unused code
npm run lint:unused-code # Check for unused exports and dependencies with Knip
```

### Pre-Commit Checklist

**Always run these commands before committing:**

1. **Auto-fix Code Quality**: `npm run lint:fix` - Fixes all auto-fixable issues
2. **Run Tests**: `npm run test:run` - Non-interactive test execution
3. **Check Types**: `npm run test:types` - Verify TypeScript compilation
4. **Check Unused Code**: `npm run lint` - Run all linters sequentially
5. **Verify Build**: `npm run build` - Ensure production build works

### Common Workflows

#### Feature Development

```bash
# Start development
npm run dev

# In another terminal, run tests in watch mode
npm test

# Before committing (ALWAYS RUN THESE)
npm run lint:fix          # Auto-fix all linting issues
npm run test:run          # Run all tests non-interactively
npm run test:types        # Verify TypeScript compilation
npm run lint              # Run all linters sequentially
```

#### Fixing Linting Issues

```bash
# Check what needs fixing
npm run lint

# Auto-fix everything possible
npm run lint:fix

# Fix specific linters
npm run lint:ts:fix       # Fix JS/TS issues
npm run lint:styles:fix   # Fix CSS issues
npm run lint:prettier:fix # Fix prettier issues
```

#### Cleaning Up Unused Code

```bash
# Identify unused exports and dependencies
npm run lint:unused-code

# Review the output and manually remove unused code
# Re-run to verify all issues are resolved
npm run lint:unused-code
```

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
