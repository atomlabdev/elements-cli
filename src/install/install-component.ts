import path, { resolve } from "path";
import fs from "fs";
import { $ } from "execa";
import { installPackages } from "./install-packages.js";
import { detect } from "@antfu/ni";

export const installComponent = (result: any, targetDir: string) => {
  return new Promise(async (resolve, reject) => {
    const { external } = result.dependencies;
    const cwd = process.cwd();

    const packageManager = await detect({ programmatic: true, cwd: cwd });

    if (external && external.length) {
      console.log(
        `Installing ${
          result.filename
        } dependencies with ${packageManager}: ${external
          .map((e: string) => e)
          .join(" ")}`
      );
      await installPackages(external, packageManager);
    }

    let filePath = path.resolve(targetDir, result.filename);
    fs.writeFile(filePath, JSON.parse(result.install), (err) => {
      if (err) {
        console.log("write file error", err);
        reject(err);
      }

      console.log(`✅ installed ${result.filename}`);

      resolve(result.name);
    });
  });
};
