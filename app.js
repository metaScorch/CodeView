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

async function generateTree(directory, prefix = "", excludeDirs = [], excludeFiles = []) {
  let tree = "";
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = entries.filter((entry) => entry.isFile());
  const directories = entries.filter((entry) => entry.isDirectory());

  for (const [index, dir] of directories.entries()) {
    if (!IGNORED_DIRS.includes(dir.name) && !excludeDirs.includes(dir.name)) {
      const isLast = index === directories.length - 1 && files.length === 0;
      tree += `${prefix}${isLast ? "└── " : "├── "}${dir.name}/\n`;
      tree += await generateTree(
        path.join(directory, dir.name),
        `${prefix}${isLast ? "    " : "│   "}`,
        excludeDirs,
        excludeFiles
      );
    }
  }

  for (const [index, file] of files.entries()) {
    if (!IGNORED_FILES.includes(file.name) && !excludeFiles.includes(file.name)) {
      const ext = path.extname(file.name);
      if (IMPORTANT_EXTENSIONS.includes(ext)) {
        const isLast = index === files.length - 1;
        tree += `${prefix}${isLast ? "└── " : "├── "}${file.name}\n`;
      }
    }
  }

  return tree;
}

// Function for complete minification
function completeMinify(content) {
  // Remove all spaces, tabs, and newlines
  return content.replace(/\s+/g, "");
}

async function readCodebaseFiles(
  directory,
  excludeDirs = [],
  excludeFiles = [],
  includeDirs = [],
  includeFiles = [],
  minify = false
) {
  let output = "";
  let fileList = [];
  let fileCount = 0;
  let totalLines = 0;
  const startTime = performance.now();
  await generateTree(directory, "", excludeDirs, excludeFiles);

  async function processDirectory(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(directory, dir);
      const relativePathSegments = relativePath.split(path.sep);

      const isExcluded = relativePathSegments.some((segment) =>
        excludeDirs.includes(segment)
      );

      const isIncludedDir =
        includeDirs.length > 0 &&
        includeDirs.some((includeDir) => fullPath.includes(includeDir));

      const isIncludedFile =
        includeFiles.length > 0 &&
        includeFiles.some((includeFile) => fullPath.includes(includeFile));

      if (
        entry.isDirectory() &&
        !IGNORED_DIRS.includes(entry.name) &&
        !excludeDirs.includes(entry.name) &&
        !isExcluded &&
        (includeDirs.length === 0 || isIncludedDir)
      ) {
        await processDirectory(fullPath);
      } else if (
        entry.isFile() &&
        !IGNORED_FILES.includes(entry.name) &&
        !excludeFiles.includes(entry.name) &&
        !isExcluded &&
        (includeFiles.length === 0 || isIncludedFile)
      ) {
        const ext = path.extname(entry.name);
        if (IMPORTANT_EXTENSIONS.includes(ext)) {
          const relativePath = path.relative(directory, fullPath);
          const content = await fs.readFile(fullPath, "utf8");
          const lines = content.split("\n").length;

          if (!minify) {
            fileList.push(`${relativePath} (starts at line ${output.split("\n").length + 1})`);
            output += `File: ${relativePath} (starts at line ${output.split("\n").length + 1})\n\n`;
            output += content;
            output += FILE_DELIMITER;
          } else {
            // In minify mode, apply complete minification
            output += completeMinify(content);
          }

          fileCount++;
          totalLines += lines;
        }
      }
    }
  }

  await processDirectory(directory);

  const endTime = performance.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  if (minify) {
    // When minified, return only the completely minified content
    return output;
  } else {
    // Not minified, include all the standard components
    const finalSummary = `Summary:
  - Directory: ${directory}
  - Files processed: ${fileCount}
  - Total lines: ${totalLines}
  - Duration: ${duration} seconds
  - Excluded directories: ${excludeDirs.length > 0 ? excludeDirs.join(", ") : "None"}
  - Excluded files: ${excludeFiles.length > 0 ? excludeFiles.join(", ") : "None"}
  - Included directories: ${includeDirs.length > 0 ? includeDirs.join(", ") : "None"}
  - Included files: ${includeFiles.length > 0 ? includeFiles.join(", ") : "None"}

${"=".repeat(80)}

`;

    const finalFileListString =
      "Files extracted:\n" +
      fileList.join("\n") +
      "\n\n" +
      "=".repeat(80) +
      "\n\n";
    const finalTree = await generateTree(directory, "", excludeDirs, excludeFiles);

    return (
      finalSummary +
      "Directory Structure:\n\n" +
      finalTree +
      "\n" +
      finalFileListString +
      output.trim()
    );
  }
}

async function main() {
  const args = process.argv.slice(2);
  let directory = null;
  let excludeDirs = [];
  let excludeFiles = [];
  let includeDirs = [];
  let includeFiles = [];
  let minify = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--exclude" || args[i] === "-e") {
      i++;
      if (i < args.length) {
        excludeDirs = args[i].split(",").map((dir) => dir.trim());
      }
    } else if (args[i] === "--exclude-file" || args[i] === "-ef") {
      i++;
      if (i < args.length) {
        excludeFiles = args[i].split(",").map((file) => file.trim());
      }
    } else if (args[i] === "--include" || args[i] === "-i") {
      i++;
      if (i < args.length) {
        includeDirs = args[i].split(",").map((dir) => dir.trim());
      }
    } else if (args[i] === "--include-file" || args[i] === "-if") {
      i++;
      if (i < args.length) {
        includeFiles = args[i].split(",").map((file) => file.trim());
      }
    } else if (args[i] === "--minify" || args[i] === "-m") {
      minify = true;
    } else if (!directory) {
      directory = args[i];
    }
  }

  if (!directory) {
    console.error("Please provide a directory path as an argument.");
    console.error(
      "Usage: node script.js <directory> [--exclude|-e <dirnames>] [--exclude-file|-ef <filenames>] [--include|-i <dirnames>] [--include-file|-if <filenames>] [--minify|-m]"
    );
    console.error(
      "Example: node script.js ./my-project --exclude test,docs --exclude-file __init__.py,setup.py --include src --include-file main.js -m"
    );
    process.exit(1);
  }

  try {
    const result = await readCodebaseFiles(
      directory,
      excludeDirs,
      excludeFiles,
      includeDirs,
      includeFiles,
      minify
    );
    const outputPath = path.join(directory, "codebase_review.txt");
    await fs.writeFile(outputPath, result);
    console.log(`Codebase contents have been written to ${outputPath}`);
    console.log(`Excluded directories: ${excludeDirs.length > 0 ? excludeDirs.join(", ") : "None"}`);
    console.log(`Excluded files: ${excludeFiles.length > 0 ? excludeFiles.join(", ") : "None"}`);
    console.log(`Included directories: ${includeDirs.length > 0 ? includeDirs.join(", ") : "None"}`);
    console.log(`Included files: ${includeFiles.length > 0 ? includeFiles.join(", ") : "None"}`);
    if (minify) {
      console.log("Output minified: All whitespace (spaces, tabs, newlines) has been removed");
      console.log("Summary, directory structure, and file list have been omitted");
    }
  } catch (error) {
    console.error("An error occurred:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});