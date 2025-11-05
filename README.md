# Adventure Book

A low-code tool for creating and testing interactive choose-your-own-adventure stories. Built with React, TypeScript, and Vite, this application allows you to easily create engaging narratives where every choice shapes the reader's journey.

## Creating Your Adventure Book

### Editing Story Content

The adventure book content is managed through simple TypeScript files. To create or modify your story:

1. **Story Structure**: Navigate to `src/data/content.ts` where all story content is defined
2. **Introduction Section**: Customize the welcome screen by editing the `introduction` object:
   ```typescript
   export const introduction: IntroductionContent = {
     title: "Your Adventure Title",
     paragraphs: [
       "First paragraph of your introduction...",
       "Second paragraph...",
       "Third paragraph...",
     ],
     buttonText: "Begin Your Adventure",
   };
   ```
3. **Passage Format**: Each passage follows this structure:

   ```typescript
   {
     id: 1, // Unique ID
     paragraphs: [
       "First paragraph of your passage...",
       "Second paragraph for more detailed narrative...",
       "Additional paragraphs as needed..."
     ],
     choices: [
       {
         text: "Choice description",
         nextId: 2 // ID of the next passage
       }
     ]
   }
   ```

4. **Adding New Passages**: Simply add new passage objects to the `passages` array
5. **Linking Passages**: Connect passages by referencing their `id` in the `nextId` field of choices
6. **Ending Passages**: Passages without choices automatically become story endings

### Content Guidelines

- **Unique IDs**: Ensure each passage has a unique identifier
- **Rich Paragraphs**: Use multiple paragraphs to create immersive, detailed narratives that draw readers into the story world
- **Paragraph Structure**: Break longer text into logical paragraphs for better readability - consider pacing, scene changes, and dramatic pauses
- **Clear Choices**: Write descriptive choice text that hints at consequences
- **Narrative Flow**: Test your story paths to ensure they make logical sense
- **Multiple Endings**: Consider creating various story conclusions for replayability

### Testing Your Story

After editing content, you can immediately test your changes:

```bash
npm run dev  # Start the development server
```

The application will automatically reload with your new content, allowing you to navigate through your story and verify all paths work correctly.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/bence-toth/adventure-book
cd adventure-book

# Install dependencies
npm install

# Start development server
npm run dev
```

## Contributing

This section contains information for developers who want to contribute to the adventure book tool itself.

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Run both ESLint and Stylelint
npm run lint:es      # Run ESLint on JavaScript/TypeScript files
npm run lint:styles  # Run Stylelint on CSS files
npm run lint:styles:fix # Run Stylelint with auto-fix

# Testing
npm test             # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:coverage # Run tests with coverage report
```

### Core Principles

#### Development Philosophy

- **Type Safety First**: Leveraging TypeScript throughout the application for robust type checking and better developer experience
- **Component-Based Architecture**: Building reusable, testable components that encapsulate behavior and styling
- **Fast Development Cycle**: Using modern tooling (Vite) for rapid iteration and development feedback
- **Accessibility-Minded**: Writing semantic HTML and ensuring proper navigation flows

#### Code Organization

- **Separation of Concerns**: Keeping data, presentation, and logic in dedicated modules
- **Test-Driven Development**: Writing tests alongside features to ensure reliability and maintainability
- **Consistent Structure**: Following established patterns for file organization and naming conventions
- **Progressive Enhancement**: Building features that work gracefully and enhance user experience

#### User Experience

- **Interactive Storytelling**: Creating engaging narratives with meaningful choices and consequences
- **Responsive Design**: Ensuring the application works across different devices and screen sizes
- **Error Resilience**: Handling edge cases gracefully and providing helpful feedback
- **Performance-Conscious**: Optimizing for fast loading and smooth interactions

### Testing Strategy

#### Testing Philosophy

- **Behavior Over Implementation**: Focus on testing user interactions and visible outcomes rather than internal implementation details
- **Comprehensive Coverage**: Include unit tests for components, integration tests for user flows, and data validation tests
- **Accessible Testing**: Use semantic queries that mirror how users interact with the application
- **Isolated and Independent**: Each test should be self-contained and not depend on the execution order of other tests

#### Testing Approach

- **Component Testing**: Verify individual components render correctly and handle user interactions
- **Integration Testing**: Test complete user journeys and component interactions
- **Data Validation**: Ensure story content and application data maintain structural integrity
- **Error Handling**: Validate graceful handling of edge cases and invalid states

#### Testing Tools and Setup

- **Modern Testing Stack**: Using Vitest for fast test execution with React Testing Library for component testing
- **DOM Environment**: jsdom provides a browser-like environment for testing without a real browser
- **User Simulation**: Testing user interactions with realistic event simulation
- **Mock Strategy**: Strategic mocking of external dependencies while preserving core application logic

### Architecture Decisions

#### Technology Stack

- **React + TypeScript**: Provides strong typing and component-based architecture
- **Vite**: Fast build tool optimized for modern development workflows
- **CSS Modules/Styled Components**: Scoped styling to prevent conflicts and improve maintainability
- **React Router**: Client-side routing for single-page application navigation

#### Development Practices

- **ESLint Configuration**: Enforcing JavaScript/TypeScript code quality and consistency standards
- **Stylelint Configuration**: Modern CSS linting with standard rules for code quality and best practices
- **Hot Module Replacement**: Fast development feedback with preserved state
- **Build Optimization**: Production builds optimized for performance and bundle size
- **Development vs Production**: Different configurations optimized for each environment

#### Story and Content Management

- **Data-Driven Narrative**: Story content separated from presentation logic
- **Extensible Structure**: Architecture supports easy addition of new story paths and content
- **Type-Safe Content**: Story data validated through TypeScript interfaces
- **Dynamic Routing**: URL-based navigation that supports bookmarking and sharing

### Development Guidelines

#### Code Quality

- Follow TypeScript best practices and leverage the type system effectively
- Write tests for new features and maintain existing test coverage
- Ensure components are accessible and follow semantic HTML principles
- Keep components focused and composable
- Follow CSS best practices using Stylelint to maintain consistent styling standards

#### Development Workflow

- Use the provided development scripts for consistent tooling
- Run tests before committing changes
- Run `npm run lint` to check both JavaScript/TypeScript and CSS code quality
- Use individual linting commands (`lint:es`, `lint:styles`) for targeted checks
- Follow the established project structure and naming conventions
- Consider performance implications of changes, especially for user interactions

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
