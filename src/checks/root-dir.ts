import { existsSync, promises as fs } from "fs";

export const rootDirCheck = async () => {
  const cwd = process.cwd();
  const dir = await fs.readdir(cwd);

  if (dir.includes("package.json")) {
    return true;
  } else {
    return false;
  }
};
