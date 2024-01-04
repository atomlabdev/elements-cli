import path from "path";
import fs from "fs";
import { logMessage } from "../utils/log.js";
import { getProjectDeps } from "../utils/get-project-deps.js";
import { expoToRn } from "../utils/expo-to-rn.js";

export const installComponent = (
  result: any,
  targetDir: string
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    let filePath = path.resolve(targetDir, result.filename);
    const deps = await getProjectDeps();

    const install = deps.includes("expo")
      ? result.install
      : expoToRn(result.install);

    fs.writeFile(filePath, JSON.parse(install), (err) => {
      if (err) {
        logMessage("error", `Error creating ${result.filename}`);
        reject(err);
      }

      logMessage("success", `installed ${result.filename}`);

      resolve(result.name);
    });
  });
};
