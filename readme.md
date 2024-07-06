# CodeView

**CodeView** is an open-source tool designed to help you consolidate and analyze your codebase using large language models (LLMs). This utility is perfect for generating a comprehensive overview of your project, including file contents, structure, and line numbers, making it easier for LLMs to provide insightful analysis and assistance.

## Features

- **Directory Traversal**: Recursively explores your project directory, including only important files.
- **Content Consolidation**: Aggregates file contents into a single document with metadata.
- **Dynamic Line Number Tracking**: Ensures accurate line numbers for each file segment.
- **Directory Tree Generation**: Creates a visual representation of the project structure.
- **Performance Metrics**: Includes timing information for the analysis process.

## Getting Started

### Prerequisites

Ensure you have Node.js installed on your system. You can download it from [Node.js](https://nodejs.org/).

### Installation

Clone this repository to your local machine:

```sh
git clone https://github.com/your-username/CodeView.git
cd CodeView
```

### Usage

Run the `CodeView` script with the path to your project directory as an argument:

```sh
node script.js /path/to/your/project
```

The output will be a `codebase_review.txt` file in the specified directory, containing a comprehensive overview of your project.

### Example

```sh
node script.js /path/to/your/project
```

This will generate a `codebase_review.txt` file with the following structure:

```txt
Summary:
  - Directory: /path/to/your/project
  - Files processed: 21
  - Total lines: 872
  - Duration: 0.02 seconds

================================================================================

Directory Structure:

├── public/
│   ├── index.html
│   ├── manifest.json
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── alert.jsx
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── dialog.jsx
│   │       └── input.jsx
│   ├── lib/
│   │   └── utils.js
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   ├── reportWebVitals.js
│   └── setupTests.js
├── README.md
├── components.json
├── jsconfig.json
├── package.json
├── postcss.config.js
└── tailwind.config.js

Files extracted:
README.md (starts at line 1)
components.json (starts at line 80)
...

================================================================================

File: README.md (starts at line 1)

# Getting Started with Create React App
...

================================================================================

File: components.json (starts at line 80)

{
  "$schema": "https://ui.shadcn.com/schema.json",
  ...
}
```

## Contributing

Contributions are welcome! Please fork this repository and submit pull requests to improve the project.

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature-branch`)
6. Create a new Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Acknowledgments

Inspired by various open-source projects aimed at improving codebase understanding and analysis using LLMs.
