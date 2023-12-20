import { promptComponentDir } from "../prompts/component-dir.js";
import { existsSync, promises as fs } from "fs";
import { $ } from "execa";
import { detect } from "@antfu/ni";
import { installPackages } from "../install/install-packages.js";
import { promptIsExpo } from "../prompts/is-expo.js";
import { Ora } from "ora";
import chalk from "chalk";
import { logMessage } from "../utils/log.js";

export const doInit = async () => {
  const cwd = process.cwd();
  const dir = await fs.readdir(cwd);

  let isExpo = false;

  if (
    dir.includes("app.json") ||
    dir.includes("app.config.js") ||
    dir.includes("app.config.ts")
  ) {
    isExpo = await promptIsExpo();
  }

  const newComponentDir = await promptComponentDir();

  if (newComponentDir) {
    const filePath = `${cwd}/elements-config.json`;

    const defaultConfig = {
      theme: "default",
      expo: isExpo,
      components: {
        directory: newComponentDir,
        installed: [],
      },
    };

    await fs.writeFile(
      filePath,
      JSON.stringify(defaultConfig, null, 2),
      "utf8"
    );

    const packageManager = await detect({ programmatic: true, cwd: cwd });
    await installPackages(["twrnc"], packageManager);

    if (!isExpo) {
      logMessage(
        "warning",
        "As you're not using Expo, you'll need to install and configure React Native Vector Icons to use many Elements components out of the box - please see the docs for instructions: https://github.com/oblador/react-native-vector-icons"
      );
    }

    return true;
  } else {
    return false;
  }
};
