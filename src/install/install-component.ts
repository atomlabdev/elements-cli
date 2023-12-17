import path, { resolve } from "path";
import fs from "fs";

export const installComponent = (result: any, targetDir: string) => {
  return new Promise(async (resolve, reject) => {
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
