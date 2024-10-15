import path from "node:path";
import fs from "node:fs/promises";
import { GREEN, RED } from "../utils/styleConstants.js";

export function up(currentDir, setCurrentDir) {
  const parentDir = path.resolve(currentDir, "..");
  if (parentDir !== currentDir) {
    setCurrentDir(parentDir);
  } else {
    console.log(GREEN, "Already at the root directory");
  }
}

export async function cd(destination, currentDir, setCurrentDir) {
  const newDir = path.resolve(currentDir, destination);

  try {
    await fs.access(newDir);
    const stats = await fs.lstat(newDir);

    if (stats.isDirectory()) {
      setCurrentDir(newDir);
    } else {
      console.log(RED, "Operation failed: Not a directory");
    }
  } catch (err) {
    console.log(RED, "Operation failed:", err.message);
  }
}

export async function ls(currentDir) {
  try {
    const files = await fs.readdir(currentDir);

    const fileData = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(currentDir, file);
        try {
          const stats = await fs.lstat(filePath);
          return {
            Name: file,
            Type: stats.isDirectory() ? "directory" : "file",
          };
        } catch (error) {
          console.error(RED, `Error accessing ${filePath}: ${error.message}`);
          return null;
        }
      })
    );

    const filteredData = fileData
      .filter((item) => item !== null)
      .sort((a, b) =>
        a.Type === b.Type
          ? a.Name.localeCompare(b.Name)
          : a.Type === "directory"
          ? -1
          : 1
      );

    console.table(filteredData);
  } catch (err) {
    console.log("Operation failed:", err.message);
  }
}
