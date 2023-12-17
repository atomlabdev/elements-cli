import { existsSync, promises as fs } from "fs";
import path, { resolve } from "path";
import prompts from "prompts";

const getComponentData = (item: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const component = await fetch(
        `https://elements.atomlab.dev/registry/${item}.json`
      );
      const componentData = await component.json();

      if (componentData) {
        resolve(componentData);
      } else {
        reject();
      }
    } catch (e) {
      reject(e);
    }
  });
};

export const doAdd = async (components: string[]) => {
  const cwd = process.cwd();
  const configFile = await fs.readFile(`${cwd}/elements-config.json`, "utf8");
  const config = JSON.parse(configFile);

  // const spinner = ora(`Installing components...`).start();
  const registry = await fetch(
    "https://elements.atomlab.dev/registry/components.json"
  );
  const registryData: any = await registry.json();
  const registryComponents = registryData.map((c: any) => c.slug);
  const invalid = components.filter(
    (c: string) => !registryComponents.includes(c)
  );
  const valid = components.filter((c: string) =>
    registryComponents.includes(c)
  );

  if (invalid.length) {
    // spinner.fail(
    //   `Component(s) not found: ${invalid.map((i: string) => i).join(", ")}`
    // );
    console.log(
      `Invalid component(s) provided: ${invalid
        .map((i: string) => i)
        .join(", ")}`
    );
    return process.exit(1);
  }

  if (!config.components.directory) {
    console.log("No component directory detected");
    return process.exit(1);
  }

  const promiseArr = valid.map((item: string) => getComponentData(item));
  const results = await Promise.all(promiseArr);
  const targetDir = `${cwd}/${config.components.directory}`;

  const existingArr = results.filter((result) => {
    const p = path.resolve(targetDir, result.filename);
    const exists = existsSync(p);

    if (exists) {
      return true;
    } else {
      return false;
    }
  });

  // console.log("existing components", existingArr);

  if (existingArr && existingArr.length) {
    const overwritePrompt = await prompts({
      type: "confirm",
      name: "value",
      message: `The following files already exist: ${existingArr.map(
        (item) => `${item.filename}`
      )} - would you like to overwrite them?`,
      initial: true,
    });

    if (!overwritePrompt || overwritePrompt.value === false) {
      return process.exit(1);
    }
  }

  results.forEach(async (result) => {
    if (result.install) {
      let filePath = path.resolve(targetDir, result.filename);
      await fs.writeFile(filePath, JSON.parse(result.install));
    }
  });
  return process.exit(0);
};
