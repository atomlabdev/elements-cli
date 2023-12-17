import { Command } from "commander";
import path, { resolve } from "path";
import { existsSync, promises as fs } from "fs";
import ora from "ora";
import prompts from "prompts";
import { promptComponentDir } from "../prompts/component-dir.js";
import { rootDirCheck } from "../checks/root-dir.js";
import { existingConfigCheck } from "../checks/existing-config.js";
import { doInit } from "../processes/init.js";

export const init = new Command()
  .name("init")
  .description("initialise elements in your project")
  .action(async (components, opts) => {
    const isRootDir = await rootDirCheck();

    if (!isRootDir) {
      console.error(
        "No package.json detected - please check you're in the root directory and try again"
      );
      return process.exit(1);
    }

    const hasExistingConfig = await existingConfigCheck();

    if (hasExistingConfig) {
      console.error("Existing elements-config.json detected.");
      return process.exit(1);
    }

    const done = await doInit();

    if (done) {
      console.log("Config created successfully");
      process.exit(0);
    } else {
      console.error("Unable to create config");
      process.exit(1);
    }
  });
