import { up, cd, ls } from "./commands/navigation.js";
import { cat, add, rn, rm, cp, mv } from "./commands/fileOperations.js";
import { osInfo } from "./commands/system.js";
import { hash } from "./commands/hash.js";
import { compress, decompress } from "./commands/compression.js";
import { getUsername } from "./utils/username.js";
import { SPARKLING_MAGENTA, CYAN, RED } from "./utils/styleConstants.js";
import readline from "node:readline";
import os from "node:os";

const username = getUsername();
const homeDir = os.homedir();
let currentDir = homeDir;

console.log(SPARKLING_MAGENTA, `Welcome to the File Manager, ${username}!`);
console.log(CYAN, `You are currently in ${currentDir}`);

function setCurrentDir(newDir) {
  currentDir = newDir;
  console.log(CYAN, `You are currently in ${currentDir}`);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

rl.prompt();

rl.on("line", (input) => {
  const [command, ...args] = input.trim().split(" ");

  switch (command) {
    case "up":
      up(currentDir, setCurrentDir);
      break;
    case "cd":
      cd(args[0], currentDir, setCurrentDir);
      break;
    case "ls":
      ls(currentDir);
      break;
    case "cat":
      cat(args[0], currentDir);
      break;
    case "add":
      add(args[0], currentDir);
      break;
    case "rn":
      rn(args[0], args[1], currentDir);
      break;
    case "rm":
      rm(args[0], currentDir);
      break;
    case "cp":
      cp(args[0], args[1], currentDir);
      break;
    case "mv":
      mv(args[0], args[1], currentDir);
      break;
    case "os":
      osInfo(args[0]);
      break;
    case "hash":
      hash(args[0], currentDir);
      break;
    case "compress":
      compress(args[0], args[1], currentDir);
      break;
    case "decompress":
      decompress(args[0], args[1], currentDir);
      break;
    case ".exit":
      rl.close();
      break;
    default:
      console.log(RED, "Invalid input");
  }

  rl.prompt();
});

rl.on("close", () => {
  console.log(
    SPARKLING_MAGENTA,
    `Thank you for using File Manager, ${username}, goodbye!`
  );
});
