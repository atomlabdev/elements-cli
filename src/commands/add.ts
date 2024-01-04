import { Command } from "commander";
import { existingConfigCheck } from "../checks/existing-config.js";
import { doInit } from "../processes/init.js";
import { rootDirCheck } from "../checks/root-dir.js";
import { validateConfig } from "../checks/validate-config.js";
import { doAdd } from "../processes/add.js";
import { logMessage } from "../utils/log.js";

export const add = new Command()
  .name("add")
  .description("add a component to your project")
  .action(async (components, opts) => {
    const cwd = process.cwd();

    const { args } = opts;

    if (!args || !args.length) {
      logMessage("error", "No components provided");
      return process.exit(1);
    }

    const isProjectRoot = await rootDirCheck();

    if (!isProjectRoot) {
      logMessage(
        "error",
        "No package.json detected - please check you're in the root directory and try again"
      );
      return process.exit(1);
    }

    const hasConfig = await existingConfigCheck();

    if (!hasConfig) {
      logMessage(
        "default",
        "No config file detected - creating elements-config.json"
      );

      const configCreated = await doInit();

      if (!configCreated) {
        logMessage("error", "Unable to create project config");
        process.exit(1);
      }
    }

    await validateConfig();

    await doAdd(args);

    logMessage("success", "Done");

    return process.exit(0);
  });
