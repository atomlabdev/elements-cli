import path, { resolve } from "path";
import fs from "fs";
import { $ } from "execa";

export const installComponent = (result: any, targetDir: string) => {
  return new Promise(async (resolve, reject) => {
    const { internal, external } = result.dependencies;

    if (external && external.length) {
      console.log("Installing external dependencies with NPM");
      await $`npm install ${external.map((i: string) => i).join(" ")}`;
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
