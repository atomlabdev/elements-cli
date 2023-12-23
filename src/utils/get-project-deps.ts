import { promises as fs } from "fs";

export const getProjectDeps = async () => {
  const cwd = process.cwd();
  const packageJsonFile = await fs.readFile(`${cwd}/package.json`, "utf8");
  const packageJson = JSON.parse(packageJsonFile);
  const packageJsonDependencies = Object.keys(packageJson["dependencies"]);

  return packageJsonDependencies;
};
