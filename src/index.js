const fs = require("fs");
const os = require("os");
const path = require("path");
const readline = require("readline");
const { pipeline } = require("stream");
const zlib = require("zlib");
const crypto = require("crypto");

// Получение имени пользователя из аргументов командной строки
const args = process.argv.slice(2);
const usernameArg = args.find((arg) => arg.startsWith("--username="));
if (!usernameArg) {
  console.log(
    `Dear friend, if you are using PowerShell, make sure you start with 'npm run start the app -- -- --username=your_name'. This is because of a bug in Node version 22 or higher.\nFor more information visit https://github.com/npm/cli/issues/7375\n\n`
  );
}
const username = usernameArg ? usernameArg.split("=")[1] : "Guest";

const homeDir = os.homedir();
let currentDir = homeDir;

console.log(`Welcome to the File Manager, ${username}!`);
console.log(`You are currently in ${currentDir}`);

// Настройка интерфейса для чтения команд
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

rl.prompt();

// Функции для команд
const commands = {
  up() {
    const parentDir = path.resolve(currentDir, "..");
    if (parentDir === currentDir) return; // Проверяем, не находимся ли мы в корне
    currentDir = parentDir;
    console.log(`You are currently in ${currentDir}`);
  },

  cd(destination) {
    const newDir = path.resolve(currentDir, destination);
    if (fs.existsSync(newDir) && fs.lstatSync(newDir).isDirectory()) {
      currentDir = newDir;

      console.log(`You are currently in ${currentDir}`);
    } else {
      console.log("Operation failed");
    }
  },

  ls() {
    fs.readdir(currentDir, (err, files) => {
      if (err) {
        console.log("Operation failed");
        return;
      }

      // Собираем информацию о типе (файл или папка) для каждого файла
      const fileData = files
        .map((file) => {
          const filePath = path.join(currentDir, file);
          try {
            const stats = fs.lstatSync(filePath); // Получаем информацию о файле синхронно
            return {
              Name: file,
              Type: stats.isDirectory() ? "directory" : "file",
            };
          } catch (error) {
            // Если возникает ошибка, просто пропускаем этот файл
            console.error(`Error accessing ${filePath}: ${error.message}`);
            return null;
          }
        })
        .filter((item) => item !== null) // Убираем файлы, к которым нет доступа
        .sort((a, b) => {
          // Сначала директории, затем файлы
          if (a.Type === b.Type) {
            return a.Name.localeCompare(b.Name); // Сортируем по имени, если тип одинаковый
          }
          return a.Type === "directory" ? -1 : 1; // Директории идут первыми
        });

      // Выводим данные в виде таблицы
      console.table(fileData);
    });
  },

  cat(filePath) {
    const fullPath = path.resolve(currentDir, filePath);
    const stream = fs.createReadStream(fullPath, "utf-8");
    stream.pipe(process.stdout);
    stream.on("error", () => {
      console.log("Operation failed");
    });
  },

  add(fileName) {
    const fullPath = path.join(currentDir, fileName);
    fs.writeFile(fullPath, "", (err) => {
      if (err) {
        console.log("Operation failed");
        return;
      }
      console.log(`File ${fileName} created`);
    });
  },

  rn(oldPath, newFileName) {
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
  },

  cp(sourcePath, destinationDir) {
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
  },

  mv(sourcePath, destinationDir) {
    commands.cp(sourcePath, destinationDir);
    fs.unlink(path.resolve(currentDir, sourcePath), (err) => {
      if (err) {
        console.log("Operation failed");
      } else {
        console.log(`File moved to ${destinationDir}`);
      }
    });
  },

  rm(filePath) {
    const fullPath = path.resolve(currentDir, filePath);
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.log("Operation failed");
      } else {
        console.log(`File ${filePath} deleted`);
      }
    });
  },

  osInfo(arg) {
    switch (arg) {
      case "--EOL":
        console.log(JSON.stringify(os.EOL));
        break;
      case "--cpus":
        const cpus = os.cpus();
        console.log(`Overall CPUs: ${cpus.length}`);
        cpus.forEach((cpu, index) => {
          console.log(
            `CPU ${index + 1}: ${cpu.model}, ${cpu.speed / 1000} GHz`
          );
        });
        break;
      case "--homedir":
        console.log(os.homedir());
        break;
      case "--username":
        console.log(os.userInfo().username);
        break;
      case "--architecture":
        console.log(os.arch());
        break;
      default:
        console.log("Invalid input");
    }
  },

  hash(filePath) {
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
  },

  compress(filePath, destinationPath) {
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
  },

  decompress(filePath, destinationPath) {
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
  },
};

// Обработка команд
rl.on("line", (input) => {
  const [command, ...args] = input.trim().split(" ");

  switch (command) {
    case "up":
      commands.up();
      break;
    case "cd":
      commands.cd(args[0]);
      break;
    case "ls":
      commands.ls();
      break;
    case "cat":
      commands.cat(args[0]);
      break;
    case "add":
      commands.add(args[0]);
      break;
    case "rn":
      commands.rn(args[0], args[1]);
      break;
    case "cp":
      commands.cp(args[0], args[1]);
      break;
    case "mv":
      commands.mv(args[0], args[1]);
      break;
    case "rm":
      commands.rm(args[0]);
      break;
    case "os":
      commands.osInfo(args[0]);
      break;
    case "hash":
      commands.hash(args[0]);
      break;
    case "compress":
      commands.compress(args[0], args[1]);
      break;
    case "decompress":
      commands.decompress(args[0], args[1]);
      break;
    case ".exit":
      rl.close();
      break;
    default:
      console.log("Invalid input");
  }

  rl.prompt();
});

rl.on("close", () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
});
