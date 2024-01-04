import { Command } from "commander";
import { rootDirCheck } from "../checks/root-dir.js";
import { existingConfigCheck } from "../checks/existing-config.js";
import { doInit } from "../processes/init.js";
import { logMessage } from "../utils/log.js";

export const init = new Command()
  .name("init")
  .description("initialise elements in your project")
  .action(async (components, opts) => {
    const isRootDir = await rootDirCheck();

    if (!isRootDir) {
      logMessage(
        "error",
        "No package.json detected - please check you're in the root directory and try again"
      );
      return process.exit(1);
    }

    const hasExistingConfig = await existingConfigCheck();

    if (hasExistingConfig) {
      logMessage("error", "Existing elements-config.json detected.");
      return process.exit(1);
    }

    const done = await doInit();

    if (done) {
      logMessage("success", "Config created successfully");
      process.exit(0);
    } else {
      logMessage("error", "Unable to create config");
      process.exit(1);
    }
  });
