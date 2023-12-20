import { Command } from "commander";
import path, { resolve } from "path";
import { existsSync, promises as fs } from "fs";
import ora from "ora";
import prompts from "prompts";
import { promptComponentDir } from "../prompts/component-dir.js";
import { existingConfigCheck } from "../checks/existing-config.js";
import { doInit } from "../processes/init.js";
import { rootDirCheck } from "../checks/root-dir.js";
import { validateConfig } from "../checks/validate-config.js";
import { doAdd } from "../processes/add.js";
import { logMessage } from "../utils/log.js";

// check component exists in registry [D]
// fetch component [D]
// ask user what directory they want to install component in [D]
// overwrite check
// write component to directory [D]

// no one command install for multiple components - for now internal dependencies must also be instlled in same command ie. npx elements add button button-group

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
