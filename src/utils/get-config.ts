import { promises as fs } from "fs";

export const getConfig = async () => {
  const cwd = process.cwd();

  const configFile = await fs.readFile(`${cwd}/elements-config.json`, "utf8");
  const config = JSON.parse(configFile);

  return config;
};
