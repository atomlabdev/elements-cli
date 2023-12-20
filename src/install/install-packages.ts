import { $ } from "execa";
import { PackageManager } from "../utils/get-install-command.js";
import { getInstallCommand } from "../utils/get-install-command.js";
import { logMessage } from "../utils/log.js";
import { existsSync, promises as fs } from "fs";

export const installPackages = (
  packages: string[],
  packageManager: PackageManager
): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const cwd = process.cwd();
      const packageJsonFile = await fs.readFile(`${cwd}/package.json`, "utf8");
      const packageJson = JSON.parse(packageJsonFile);
      const packageJsonDependencies = Object.keys(packageJson["dependencies"]);

      const dependencies = packages.reduce(
        (prev: any, curr: any) => {
          if (packageJsonDependencies.includes(curr)) {
            return {
              existing: [...prev.existing, curr],
              new: prev.new,
            };
          } else {
            return {
              existing: prev.existing,
              new: [...prev.new, curr],
            };
          }
        },
        {
          existing: [],
          new: [],
        }
      );

      if (dependencies.existing.length) {
        logMessage(
          "default",
          `Skipping already installed dependencies: ${dependencies.existing
            .map((d) => d)
            .join(", ")}`
        );
      }

      if (dependencies.new.length) {
        const installCommand = getInstallCommand(packageManager);
        const packagesStr = dependencies.new.map((p) => p).join(", ");
        logMessage(
          "action",
          `Installing external dependencies with ${packageManager}: ${packagesStr}`
        );
        await $`${packageManager || ""} ${installCommand} ${packagesStr}`;
        resolve(true);
      } else {
        resolve(true);
      }
    } catch (e) {
      reject(false);
    }
  });
};
