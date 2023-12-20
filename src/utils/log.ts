import chalk from "chalk";

type LogMessageType = "success" | "warning" | "error" | "action" | "default";

export const logMessage = (type: LogMessageType, message: string) => {
  if (type === "error") {
    console.log(chalk.red(`❌ ${message}`));
    return;
  }

  if (type === "warning") {
    console.log(chalk.yellow(`⚠️ ${message}`));
    return;
  }

  if (type === "success") {
    console.log(chalk.green(`✅ ${message}`));
    return;
  }

  if (type === "action") {
    console.log(chalk.blue(`⚙️ ${message}`));
    return;
  }

  console.log(message);
  return;
};
