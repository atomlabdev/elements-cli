import { existsSync, promises as fs } from "fs";
import { promptComponentDir } from "../prompts/component-dir.js";

export const validateConfig = async () => {
  const cwd = process.cwd();

  const configFile = await fs.readFile(`${cwd}/elements-config.json`, "utf8");
  const config = JSON.parse(configFile);

  if (!config.components) {
    const newComponentDir = await promptComponentDir();

    const newComponentObj = {
      directory: newComponentDir,
      installed: [],
    };

    const updatedConfig = {
      ...config,
      components: newComponentObj,
    };

    await fs.writeFile(
      `${cwd}/elements-config.json`,
      JSON.stringify(updatedConfig, null, 2),
      "utf8"
    );
  }
};
