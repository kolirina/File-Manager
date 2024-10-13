import zlib from "node:zlib";
import fs from "node:fs";
import path from "node:path";

export function compress(filePath, destinationPath) {
  const source = path.resolve(currentDir, filePath);
  const destination = path.resolve(currentDir, destinationPath);
  const readStream = fs.createReadStream(source);
  const writeStream = fs.createWriteStream(destination);
  const brotli = zlib.createBrotliCompress();

  pipeline(readStream, brotli, writeStream, (err) => {
    if (err) {
      console.log("Operation failed");
    } else {
      console.log("File compressed");
    }
  });
}

export function decompress(filePath, destinationPath) {
  const source = path.resolve(currentDir, filePath);
  const destination = path.resolve(currentDir, destinationPath);
  const readStream = fs.createReadStream(source);
  const writeStream = fs.createWriteStream(destination);
  const brotli = zlib.createBrotliDecompress();

  pipeline(readStream, brotli, writeStream, (err) => {
    if (err) {
      console.log("Operation failed");
    } else {
      console.log("File decompressed");
    }
  });
}
