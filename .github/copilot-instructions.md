# GitHub Copilot Instructions for Adventure Book

## Project Context

Adventure Book is a TypeScript React application that enables non-technical writers to create interactive choose-your-own-adventure stories through YAML-based content authoring. The application separates content from implementation, treating adventure data as immutable input flowing through a validation and rendering pipeline.

## Code Review Priorities

### Critical Review Areas

1. **Content Independence**: Verify that code never hardcodes adventure-specific content, passage IDs, or narrative flows
2. **Test Coverage**: Ensure all new functionality has comprehensive tests written with mock data
3. **Type Safety**: Check for proper TypeScript usage without `any` types in production code
4. **Pure Functions**: Confirm functions are stateless with clear inputs and outputs
5. **Accessibility**: Validate semantic HTML and ARIA attributes where needed

### Architecture Patterns to Enforce

- **Data Flow**: YAML → Parser → Validation → Type-Safe Objects → React Components → UI
- **State Management**: Minimal state using React built-ins, localStorage for persistence only
- **Error Handling**: Graceful degradation with clear, actionable error messages
- **Component Structure**: Hooks → Event handlers → Early returns → Render logic

### Common Anti-Patterns to Flag

❌ **Direct adventure content references**

```typescript
if (passageId === 1) navigate("/passage/2"); // Brittle
```

❌ **Testing with actual adventure content**

```typescript
expect(screen.getByText("dark forest")).toBeInTheDocument(); // Breaks when content changes
```

❌ **Using `any` types**

```typescript
const data: any = loadAdventure(); // Loses type safety
```

❌ **Mutating props or state**

```typescript
props.passage.choices.push(newChoice); // Side effects
```

❌ **Testing implementation details**

```typescript
expect(component.state.internalValue).toBe(5); // Tests internals
```

### Recommended Patterns

✅ **Generic, data-driven navigation**

```typescript
const handleChoiceClick = (targetPassageId: number) => {
  navigate(`/passage/${targetPassageId}`);
};
```

✅ **Content-independent testing**

```typescript
const mockPassage = createMockPassage(["Test paragraph"]);
vi.mocked(getPassage).mockReturnValue(mockPassage);
```

✅ **Strong typing throughout**

```typescript
interface Choice {
  text: string;
  goto: number;
}
```

✅ **Immutable transformations**

```typescript
const updatedChoices = [...passage.choices, newChoice];
```

✅ **Testing user behavior**

```typescript
fireEvent.click(screen.getByRole("button", { name: /continue/i }));
expect(mockNavigate).toHaveBeenCalledWith("/passage/2");
```

## Code Review Checklist

### Before Approving Changes

- [ ] No hardcoded adventure content or passage IDs
- [ ] Components use semantic HTML and maintain accessibility
- [ ] Functions are pure when possible, with minimal side effects
- [ ] Error handling provides clear, actionable messages
- [ ] Code follows declarative patterns (what, not how)
- [ ] Mock data is used in tests, not actual adventure content
- [ ] Changes work with any valid adventure structure, not just the current one

### Extension Review Guidelines

When reviewing new features:

1. **Does it maintain content independence?** New features must work with any valid adventure structure
2. **Is the interface generic?** APIs should not assume specific adventure patterns
3. **Can authors use it freely?** Features shouldn't constrain creative adventure design
4. **Is it testable with mocks?** Must be testable without real adventure content

## Suggestions for Improvements

When suggesting improvements, prioritize:

1. **Simplification**: Can this be simpler while achieving the same goal?
2. **Type safety**: Can we leverage TypeScript more effectively?
3. **Testability**: Would this be easier to test with a different structure?
4. **Reusability**: Could this be more generic and reusable?
5. **Accessibility**: Are there semantic or ARIA improvements to make?

## Context for Reviews

- **Adventure Content Changes**: Should never require code changes or break tests
- **Core Value**: Enable non-technical writers through declarative YAML
- **Development Philosophy**: Test-driven, type-safe, pure functional where possible
- **User Experience**: Performance, accessibility, and clear error messages are paramount

Remember: If a test breaks when adventure content changes, the test is incorrectly coupled to content. If code needs modification when an adventure structure changes, the abstraction is insufficient.
