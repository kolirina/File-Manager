import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { YELLOW, RED } from "../utils/styleConstants.js";

export function hash(filePath, currentDir) {
  const fullPath = path.resolve(currentDir, filePath);
  const hash = crypto.createHash("sha256");
  const stream = fs.createReadStream(fullPath);
  stream.on("data", (chunk) => {
    hash.update(chunk);
  });
  stream.on("end", () => {
    console.log(YELLOW, hash.digest("hex"));
  });
  stream.on("error", () => {
    console.log(RED, "Operation failed");
  });
}
