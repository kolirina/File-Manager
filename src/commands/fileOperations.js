import fs from "node:fs";
import path from "node:path";

export function cat(filePath, currentDir) {
  const fullPath = path.resolve(currentDir, filePath);
  const stream = fs.createReadStream(fullPath, "utf-8");
  stream.pipe(process.stdout);
  stream.on("error", () => {
    console.log("Operation failed");
  });
}

export function add(fileName) {
  const fullPath = path.join(currentDir, fileName);
  fs.writeFile(fullPath, "", (err) => {
    if (err) {
      console.log("Operation failed");
      return;
    }
    console.log(`File ${fileName} created`);
  });
}

export function rn(oldPath, newFileName) {
  const fullOldPath = path.resolve(currentDir, oldPath);
  const { dir } = path.parse(fullOldPath);
  const fullNewPath = path.join(dir, newFileName);
  fs.rename(fullOldPath, fullNewPath, (err) => {
    if (err) {
      console.log("Operation failed");
      return;
    }
    console.log(`File renamed to ${newFileName}`);
  });
}

export function cp(sourcePath, destinationDir) {
  const fullSource = path.resolve(currentDir, sourcePath);
  const { base } = path.parse(fullSource);
  const destinationPath = path.join(destinationDir, base);
  const fullDestination = path.resolve(currentDir, destinationPath);
  const readStream = fs.createReadStream(fullSource);
  const writeStream = fs.createWriteStream(fullDestination);
  pipeline(readStream, writeStream, (err) => {
    if (err) {
      console.log("Operation failed");
    } else {
      console.log(`File copied to ${destinationPath}`);
    }
  });
}

export function mv(sourcePath, destinationDir) {
  commands.cp(sourcePath, destinationDir);
  fs.unlink(path.resolve(currentDir, sourcePath), (err) => {
    if (err) {
      console.log("Operation failed");
    } else {
      console.log(`File moved to ${destinationDir}`);
    }
  });
}

export function rm(filePath) {
  const fullPath = path.resolve(currentDir, filePath);
  fs.unlink(fullPath, (err) => {
    if (err) {
      console.log("Operation failed");
    } else {
      console.log(`File ${filePath} deleted`);
    }
  });
}
