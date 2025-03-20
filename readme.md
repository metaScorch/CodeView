# CodeView

**CodeView** is an open-source script designed to help you consolidate and analyze your codebase using large language models (LLMs). This utility is perfect for generating a comprehensive overview of your project, including file contents, structure, and line numbers, making it easier for LLMs to provide insightful analysis and assistance.

## Features

- **Directory Traversal**: Recursively explores your project directory, including only important files.
- **Content Consolidation**: Aggregates file contents into a single document with metadata.
- **Dynamic Line Number Tracking**: Ensures accurate line numbers for each file segment.
- **Directory Tree Generation**: Creates a visual representation of the project structure.
- **Performance Metrics**: Includes timing information for the analysis process.
- **Directory and File Exclusion**: Dynamically exclude specific directories or files beyond the default ignored ones.
- **Directory and File Inclusion**: Optionally include only specific directories or files for processing.
- **Minification**: Optionally minify the output by removing all whitespace (spaces, tabs, and newlines).

## Getting Started

### Prerequisites

Ensure you have Node.js installed on your system. You can download it from [Node.js](https://nodejs.org/).

### Installation

Clone this repository to your local machine:

```bash
git clone https://github.com/CanParlayan/CodeView.git
cd CodeView
```

## Usage

Run the `CodeView` script with the path to your project directory as an argument:

```bash
node script.js /path/to/your/project
```

### Excluding Directories or Files

To exclude specific directories or files:

```bash
node script.js /path/to/your/project --exclude tests,docs --exclude-file __init__.py,setup.py
```

or using the short form:

```bash
node script.js /path/to/your/project -e tests,docs -ef __init__.py,setup.py
```

### Including Specific Directories or Files

To include only specific directories or files:

```bash
node script.js /path/to/your/project --include src,lib --include-file main.js,utils.js
```

or using the short form:

```bash
node script.js /path/to/your/project -i src,lib -if main.js,utils.js
```

### Minifying Output

To minify the output (remove all whitespace):

```bash
node script.js /path/to/your/project --minify
```

or using the short form:

```bash
node script.js /path/to/your/project -m
```

### Example

```bash
node script.js /path/to/your/project --include src --include-file main.js --minify
```

This will generate a `codebase_review.txt` file with the following structure (if not minified):

```
Summary:
  - Directory: /path/to/your/project
  - Files processed: 21
  - Total lines: 872
  - Duration: 0.02 seconds
  - Excluded directories: None
  - Excluded files: None
  - Included directories: src
  - Included files: main.js

================================================================================

Directory Structure:

src/
├── components/
│   └── ui/
│       ├── alert.jsx
│       ├── button.jsx
│       ├── card.jsx
│       ├── dialog.jsx
│       └── input.jsx
├── lib/
│   └── utils.js
├── App.css
├── App.js
├── App.test.js
├── index.css
├── index.js
├── reportWebVitals.js
└── setupTests.js

Files extracted:
src/main.js (starts at line 1)
src/lib/utils.js (starts at line 80)
...

================================================================================

File: src/main.js (starts at line 1)

import React from 'react';
import ReactDOM from 'react-dom';
...

================================================================================

File: src/lib/utils.js (starts at line 80)

export function formatDate(date) {
  ...
}
```

### Command Line Arguments

| Argument          | Alias | Description                                                                 |
|-------------------|-------|-----------------------------------------------------------------------------|
| `--exclude`       | `-e`  | Comma-separated list of directories to exclude from processing              |
| `--exclude-file`  | `-ef` | Comma-separated list of files to exclude from processing                    |
| `--include`       | `-i`  | Comma-separated list of directories to include (only these will be processed) |
| `--include-file`  | `-if` | Comma-separated list of files to include (only these will be processed)     |
| `--minify`        | `-m`  | Minify the output by removing all whitespace (spaces, tabs, and newlines)   |

## Contributing

Contributions are welcome! Please fork this repository and submit pull requests to improve the project.

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature-branch`)
6. Create a new Pull Request

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Acknowledgments

Inspired by various open-source projects aimed at improving codebase understanding and analysis using LLMs.

---
