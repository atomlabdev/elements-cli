import { promptComponentDir } from "../prompts/component-dir.js";
import { existsSync, promises as fs } from "fs";
import { $ } from "execa";
import { detect } from "@antfu/ni";
import { installPackages } from "../install/install-packages.js";

export const doInit = async () => {
  const cwd = process.cwd();

  const newComponentDir = await promptComponentDir();

  if (newComponentDir) {
    const filePath = `${cwd}/elements-config.json`;

    const defaultConfig = {
      theme: "default",
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

    return true;
  } else {
    return false;
  }
};
