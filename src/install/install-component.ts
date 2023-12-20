import path, { resolve } from "path";
import fs from "fs";
import { $ } from "execa";
import { installPackages } from "./install-packages.js";
import { detect } from "@antfu/ni";
import { logMessage } from "../utils/log.js";

// todo - move dependencies to components.json

export const installComponent = (result: any, targetDir: string) => {
  return new Promise(async (resolve, reject) => {
    let filePath = path.resolve(targetDir, result.filename);
    fs.writeFile(filePath, JSON.parse(result.install), (err) => {
      if (err) {
        logMessage("error", `Error creating ${result.filename}`);
        reject(err);
      }

      logMessage("success", `installed ${result.filename}`);

      resolve(result.name);
    });
  });
};
