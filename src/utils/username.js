export function getUsername() {
  const args = process.argv.slice(2);
  const usernameArg = args.find((arg) => arg.startsWith("--username="));
  if (!usernameArg) {
    console.log(
      `Dear friend, if you are using PowerShell, make sure you start with 'npm run start the app -- -- --username=your_name'. This is because of a bug in Node version 22 or higher.\nFor more information visit https://github.com/npm/cli/issues/7375\n\n`
    );
    console.log(`Warning: Username not provided. Using 'Guest'.`);
    return "Guest";
  }
  return usernameArg.split("=")[1];
}
