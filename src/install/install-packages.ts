import { $ } from "execa";
import { PackageManager } from "../utils/get-install-command.js";
import { getInstallCommand } from "../utils/get-install-command.js";

export const installPackages = (
  packages: string[],
  packageManager: PackageManager
): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const installCommand = getInstallCommand(packageManager);
      const packagesStr = packages.map((p) => p).join(" ");
      console.log(
        `Installing external dependencies with ${packageManager}: ${packagesStr}`
      );
      await $`${packageManager || ""} ${installCommand} ${packagesStr}`;
      resolve(true);
    } catch (e) {
      reject(false);
    }
  });
};
