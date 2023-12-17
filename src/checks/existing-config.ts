import { existsSync, promises as fs } from "fs";

export const existingConfigCheck = async () => {
  const cwd = process.cwd();
  const dir = await fs.readdir(cwd);

  if (dir.includes("elements-config.json")) {
    return true;
  } else {
    return false;
  }
};
