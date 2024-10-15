import os from "node:os";
import { GREEN, SPARKLING_MAGENTA, RED } from "../utils/styleConstants.js";

export function osInfo(arg) {
  switch (arg) {
    case "--EOL":
      console.log(GREEN, JSON.stringify(os.EOL));
      break;
    case "--cpus":
      const cpus = os.cpus();
      console.log(SPARKLING_MAGENTA, `Overall CPUs: ${cpus.length}`);
      cpus.forEach((cpu, index) => {
        console.log(
          GREEN,
          `CPU ${index + 1}: ${cpu.model}, ${cpu.speed / 1000} GHz`
        );
      });
      break;
    case "--homedir":
      console.log(GREEN, os.homedir());
      break;
    case "--username":
      console.log(GREEN, os.userInfo().username);
      break;
    case "--architecture":
      console.log(GREEN, os.arch());
      break;
    default:
      console.log(RED, "Invalid input");
  }
}
