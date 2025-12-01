# ⚔️ Adventure Book Companion

A low-code tool for creating and testing interactive choose-your-own-adventure stories. Built with React, TypeScript, and Vite, this application allows you to easily create engaging narratives where every choice shapes the reader's journey.

## Creating Your Adventure Book

### Editing Adventure Content

The adventure book system supports authoring stories in YAML format, making it easy for writers to create interactive narratives without touching code.

#### Basic YAML Structure

An adventure YAML file has three main sections:

```yaml
metadata:
  title: "Your Adventure Title"
  author: "Author Name"
  version: "1.0"

intro:
  text: |
    Your introduction text here.

    Multiple paragraphs are supported.
    Use pipe (|) notation for multi-line text.

passages:
  1:
    text: |
      Passage text here.

      Each paragraph should be separated by blank lines.
    choices:
      - text: "Choice text"
        goto: 2
      - text: "Another choice"
        goto: 3

  2:
    text: |
      Another passage…
    ending: true
    type: "victory"
```

#### Key Features

1. **Numbered Passages**: Use numbers as passage IDs (1, 2, 3, etc.). You can skip numbers (1, 5, 10) to leave room for future insertions.

2. **Multiple Paragraph Support**: Use YAML's pipe (`|`) notation for multi-line text. Separate paragraphs with blank lines in the YAML.

3. **Choices**: Each passage can have multiple choices with `text` and `goto` properties.

4. **Endings**: Mark ending passages with `ending: true`. Optional `type` can be "victory", "defeat", or "neutral".

#### File Location

Your adventure content is defined in:

- `src/data/adventure.yaml` - The main adventure file

To modify your adventure, simply edit this YAML file and the changes will be reflected immediately in development mode.

### Writing Guidelines

1. **Use descriptive choice text**: Make each option clear and engaging
2. **Plan your numbering**: Leave gaps for future expansion (use 10, 20, 30 for major sections)
3. **Test your paths**: Ensure all choices lead somewhere
4. **Consider multiple endings**: Different outcomes increase replayability
5. **Rich Paragraphs**: Use multiple paragraphs to create immersive, detailed narratives
6. **Paragraph Structure**: Break longer text into logical paragraphs for better readability

#### Technical Notes

- The system validates all `goto` references on load
- Broken references will show errors in the console
- The YAML is parsed and validated automatically

### Testing Your Adventure

After editing content, you can immediately test your changes:

```bash
npm run dev  # Start the development server
```

The application will automatically reload with your new content, allowing you to navigate through your adventure and verify all paths work correctly.

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

We welcome contributions from the community! Whether you want to report bugs, suggest new features, improve documentation, or submit code changes, your contributions are greatly appreciated.

Please see our [Contributing Guide](CONTRIBUTING.md) for detailed information about:

- Ways to contribute and getting started
- Development workflow and available scripts
- Core principles and architecture decisions
- Testing strategy and code quality guidelines
- Code of conduct and community standards

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
