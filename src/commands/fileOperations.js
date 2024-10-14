import { pipeline } from "node:stream/promises";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { GREEN, RED } from "../utils/styleConstants.js";

export async function cat(filePath, currentDir) {
  const fullPath = path.resolve(currentDir, filePath);

  try {
    const stream = fs.createReadStream(fullPath, "utf-8");
    stream.pipe(process.stdout);
    stream.on("error", () => {
      console.log(RED, "Operation failed");
    });
  } catch (err) {
    console.log(RED, "Operation failed:", err.message);
  }
}

export async function add(fileName, currentDir) {
  const fullPath = path.join(currentDir, fileName);

  try {
    await fsp.writeFile(fullPath, "");
    console.log(GREEN, `File ${fileName} created`);
  } catch (err) {
    console.log(RED, "Operation failed:", err.message);
  }
}

export async function rn(oldPath, newFileName, currentDir) {
  const fullOldPath = path.resolve(currentDir, oldPath);
  const { dir } = path.parse(fullOldPath);
  const fullNewPath = path.join(dir, newFileName);

  try {
    await fsp.rename(fullOldPath, fullNewPath);
    console.log(GREEN, `File renamed to ${newFileName}`);
  } catch (err) {
    console.log(RED, "Operation failed:", err.message);
  }
}

export async function cp(sourcePath, destinationDir, currentDir) {
  const fullSource = path.resolve(currentDir, sourcePath);
  const { base } = path.parse(fullSource);
  const destinationPath = path.join(destinationDir, base);
  const fullDestination = path.resolve(currentDir, destinationPath);

  try {
    const readStream = fs.createReadStream(fullSource);
    const writeStream = fs.createWriteStream(fullDestination);
    await pipeline(readStream, writeStream);
    console.log(GREEN, `File copied to ${destinationPath}`);
  } catch (err) {
    console.log(RED, "Operation failed:", err.message);
  }
}

export async function mv(sourcePath, destinationDir, currentDir) {
  try {
    await cp(sourcePath, destinationDir, currentDir);
    await rm(sourcePath, currentDir);
    console.log(GREEN, `File moved to ${destinationDir}`);
  } catch (err) {
    console.log(RED, "Operation failed:", err.message);
  }
}

export async function rm(filePath, currentDir) {
  const fullPath = path.resolve(currentDir, filePath);

  try {
    await fsp.unlink(fullPath);
    console.log(GREEN, `File ${filePath} deleted`);
  } catch (err) {
    console.log(RED, "Operation failed:", err.message);
  }
}
