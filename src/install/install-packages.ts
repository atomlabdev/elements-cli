import { $ } from "execa";
import { getInstallCommand } from "../utils/get-install-command.js";
import { logMessage } from "../utils/log.js";
import { getProjectDeps } from "../utils/get-project-deps.js";

type SortedDependencies = {
  existing: string[];
  new: string[];
};

export const installPackages = (packages: string[]): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const packageJsonDependencies = await getProjectDeps();

      const dependencies: SortedDependencies = packages.reduce(
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
        const installCommand = await getInstallCommand();
        const packagesStr = dependencies.new.map((p) => p).join(", ");
        logMessage(
          "action",
          `Installing external dependencies: ${packagesStr}`
        );
        await $`npx expo install ${packagesStr}`;
        resolve(true);
      } else {
        resolve(true);
      }
    } catch (e) {
      console.log("install error", e);
      reject(false);
    }
  });
};
