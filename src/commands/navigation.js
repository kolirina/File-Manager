import path from "node:path";
import fs from "node:fs";

export function up() {
  const parentDir = path.resolve(currentDir, "..");
  if (parentDir !== currentDir) {
    currentDir = parentDir;
    console.log(`You are currently in ${currentDir}`);
  }
}

export function cd(destination, currentDir, setCurrentDir) {
  const newDir = path.resolve(currentDir, destination);
  if (fs.existsSync(newDir) && fs.lstatSync(newDir).isDirectory()) {
    setCurrentDir(newDir);
    console.log(`You are currently in ${newDir}`);
  } else {
    console.log("Operation failed");
  }
}

export function ls(currentDir) {
  fs.readdir(currentDir, (err, files) => {
    if (err) {
      console.log("Operation failed");
      return;
    }

    const fileData = files
      .map((file) => {
        const filePath = path.join(currentDir, file);
        try {
          const stats = fs.lstatSync(filePath);
          return {
            Name: file,
            Type: stats.isDirectory() ? "directory" : "file",
          };
        } catch (error) {
          console.error(`Error accessing ${filePath}: ${error.message}`);
          return null;
        }
      })
      .filter((item) => item !== null)
      .sort((a, b) =>
        a.Type === b.Type
          ? a.Name.localeCompare(b.Name)
          : a.Type === "directory"
          ? -1
          : 1
      );

    console.table(fileData);
  });
}
