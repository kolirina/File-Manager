import crypto from "node:crypto";
import fs from "node:fs";

export function hash(filePath) {
  const fullPath = path.resolve(currentDir, filePath);
  const hash = crypto.createHash("sha256");
  const stream = fs.createReadStream(fullPath);
  stream.on("data", (chunk) => {
    hash.update(chunk);
  });
  stream.on("end", () => {
    console.log(hash.digest("hex"));
  });
  stream.on("error", () => {
    console.log("Operation failed");
  });
}
