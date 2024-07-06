const fs = require("fs").promises;
const path = require("path");
const { performance } = require("perf_hooks");

const IGNORED_DIRS = ["node_modules", "build", "dist", ".git"];
const IGNORED_FILES = [
  ".DS_Store",
  ".gitignore",
  "package-lock.json",
  "yarn.lock",
];
const IMPORTANT_EXTENSIONS = [
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".py",
  ".css",
  ".html",
  ".md",
  ".json",
];
const FILE_DELIMITER = "\n\n" + "=".repeat(80) + "\n\n";

async function generateTree(directory, prefix = "") {
  let tree = "";
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = entries.filter((entry) => entry.isFile());
  const directories = entries.filter((entry) => entry.isDirectory());

  for (const [index, dir] of directories.entries()) {
    if (!IGNORED_DIRS.includes(dir.name)) {
      const isLast = index === directories.length - 1 && files.length === 0;
      tree += `${prefix}${isLast ? "└── " : "├── "}${dir.name}/\n`;
      tree += await generateTree(
        path.join(directory, dir.name),
        `${prefix}${isLast ? "    " : "│   "}`
      );
    }
  }

  for (const [index, file] of files.entries()) {
    if (!IGNORED_FILES.includes(file.name)) {
      const ext = path.extname(file.name);
      if (IMPORTANT_EXTENSIONS.includes(ext)) {
        const isLast = index === files.length - 1;
        tree += `${prefix}${isLast ? "└── " : "├── "}${file.name}\n`;
      }
    }
  }

  return tree;
}

async function readCodebaseFiles(directory) {
  let output = "";
  let fileList = [];
  let fileCount = 0;
  let totalLines = 0;
  const startTime = performance.now();

  // Generate summary and directory structure first
  const tree = await generateTree(directory);
  const summary = `Summary:
  - Directory: ${directory}
  - Files processed: ${fileCount}
  - Total lines: ${totalLines}
  - Duration: 0.00 seconds

${"=".repeat(80)}

`;

  const fileListString =
    "Files extracted:\n" +
    fileList.join("\n") +
    "\n\n" +
    "=".repeat(80) +
    "\n\n";

  // Calculate the initial offset dynamically
  const initialContent =
    summary + "Directory Structure:\n\n" + tree + "\n" + fileListString;
  const initialOffset = initialContent.split("\n").length;

  let currentLine = initialOffset + 1; // Start after the initial offset

  async function processDirectory(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory() && !IGNORED_DIRS.includes(entry.name)) {
        await processDirectory(fullPath);
      } else if (entry.isFile() && !IGNORED_FILES.includes(entry.name)) {
        const ext = path.extname(entry.name);
        if (IMPORTANT_EXTENSIONS.includes(ext)) {
          const relativePath = path.relative(directory, fullPath);
          const content = await fs.readFile(fullPath, "utf8");
          const lines = content.split("\n").length;
          fileList.push(`${relativePath} (starts at line ${currentLine})`);
          output += `File: ${relativePath} (starts at line ${currentLine})\n\n`;
          currentLine += 2; // For the header and empty line
          output += content;
          currentLine += lines;
          output += FILE_DELIMITER;
          currentLine += FILE_DELIMITER.split("\n").length;
          fileCount++;
          totalLines += lines;
        }
      }
    }
  }

  await processDirectory(directory);

  const endTime = performance.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  const finalSummary = `Summary:
  - Directory: ${directory}
  - Files processed: ${fileCount}
  - Total lines: ${totalLines}
  - Duration: ${duration} seconds

${"=".repeat(80)}

`;

  const finalFileListString =
    "Files extracted:\n" +
    fileList.join("\n") +
    "\n\n" +
    "=".repeat(80) +
    "\n\n";
  const finalTree = await generateTree(directory);

  return (
    finalSummary +
    "Directory Structure:\n\n" +
    finalTree +
    "\n" +
    finalFileListString +
    output.trim()
  );
}

async function main() {
  const directory = process.argv[2];
  if (!directory) {
    console.error("Please provide a directory path as an argument.");
    process.exit(1);
  }

  try {
    const result = await readCodebaseFiles(directory);
    const outputPath = path.join(directory, "codebase_review.txt");
    await fs.writeFile(outputPath, result);
    console.log(`Codebase contents have been written to ${outputPath}`);
  } catch (error) {
    console.error("An error occurred:", error);
    process.exit(1);
  }
}

main();
