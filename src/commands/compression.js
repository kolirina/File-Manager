import zlib from "node:zlib";
import fs from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream/promises";

export async function compress(filePath, destinationPath, currentDir) {
  const source = path.resolve(currentDir, filePath);
  const destination = path.resolve(currentDir, destinationPath);
  const readStream = fs.createReadStream(source);
  const writeStream = fs.createWriteStream(destination);
  const brotli = zlib.createBrotliCompress();

  try {
    await pipeline(readStream, brotli, writeStream);
    console.log("File compressed");
  } catch (err) {
    console.log("Operation failed:", err.message);
  }
}

export async function decompress(filePath, destinationPath, currentDir) {
  const source = path.resolve(currentDir, filePath);
  const destination = path.resolve(currentDir, destinationPath);
  const readStream = fs.createReadStream(source);
  const writeStream = fs.createWriteStream(destination);
  const brotli = zlib.createBrotliDecompress();

  try {
    await pipeline(readStream, brotli, writeStream);
    console.log("File decompressed");
  } catch (err) {
    console.log("Operation failed:", err.message);
  }
}
