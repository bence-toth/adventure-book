# Adventure Book

An interactive choose-your-own-adventure application built with React, TypeScript, and Vite. Navigate through a digital realm of programming concepts where every choice shapes your understanding of code.

## Core Principles

### Development Philosophy

- **Type Safety First**: Leveraging TypeScript throughout the application for robust type checking and better developer experience
- **Component-Based Architecture**: Building reusable, testable components that encapsulate behavior and styling
- **Fast Development Cycle**: Using modern tooling (Vite) for rapid iteration and development feedback
- **Accessibility-Minded**: Writing semantic HTML and ensuring proper navigation flows

### Code Organization

- **Separation of Concerns**: Keeping data, presentation, and logic in dedicated modules
- **Test-Driven Development**: Writing tests alongside features to ensure reliability and maintainability
- **Consistent Structure**: Following established patterns for file organization and naming conventions
- **Progressive Enhancement**: Building features that work gracefully and enhance user experience

### User Experience

- **Interactive Storytelling**: Creating engaging narratives with meaningful choices and consequences
- **Responsive Design**: Ensuring the application works across different devices and screen sizes
- **Error Resilience**: Handling edge cases gracefully and providing helpful feedback
- **Performance-Conscious**: Optimizing for fast loading and smooth interactions

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

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Testing
npm test             # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:coverage # Run tests with coverage report
```

## Testing Strategy

### Testing Philosophy

- **Behavior Over Implementation**: Focus on testing user interactions and visible outcomes rather than internal implementation details
- **Comprehensive Coverage**: Include unit tests for components, integration tests for user flows, and data validation tests
- **Accessible Testing**: Use semantic queries that mirror how users interact with the application
- **Isolated and Independent**: Each test should be self-contained and not depend on the execution order of other tests

### Testing Approach

- **Component Testing**: Verify individual components render correctly and handle user interactions
- **Integration Testing**: Test complete user journeys and component interactions
- **Data Validation**: Ensure story content and application data maintain structural integrity
- **Error Handling**: Validate graceful handling of edge cases and invalid states

### Testing Tools and Setup

- **Modern Testing Stack**: Using Vitest for fast test execution with React Testing Library for component testing
- **DOM Environment**: jsdom provides a browser-like environment for testing without a real browser
- **User Simulation**: Testing user interactions with realistic event simulation
- **Mock Strategy**: Strategic mocking of external dependencies while preserving core application logic

## Architecture Decisions

### Technology Stack

- **React + TypeScript**: Provides strong typing and component-based architecture
- **Vite**: Fast build tool optimized for modern development workflows
- **CSS Modules/Styled Components**: Scoped styling to prevent conflicts and improve maintainability
- **React Router**: Client-side routing for single-page application navigation

### Development Practices

- **ESLint Configuration**: Enforcing code quality and consistency standards
- **Hot Module Replacement**: Fast development feedback with preserved state
- **Build Optimization**: Production builds optimized for performance and bundle size
- **Development vs Production**: Different configurations optimized for each environment

### Story and Content Management

- **Data-Driven Narrative**: Story content separated from presentation logic
- **Extensible Structure**: Architecture supports easy addition of new story paths and content
- **Type-Safe Content**: Story data validated through TypeScript interfaces
- **Dynamic Routing**: URL-based navigation that supports bookmarking and sharing

## Contributing Guidelines

### Code Quality

- Follow TypeScript best practices and leverage the type system effectively
- Write tests for new features and maintain existing test coverage
- Ensure components are accessible and follow semantic HTML principles
- Keep components focused and composable

### Development Workflow

- Use the provided development scripts for consistent tooling
- Run tests before committing changes
- Follow the established project structure and naming conventions
- Consider performance implications of changes, especially for user interactions
