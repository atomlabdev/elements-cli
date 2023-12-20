import { existsSync, promises as fs } from "fs";
import path, { resolve } from "path";
import prompts from "prompts";
import { installComponent } from "../install/install-component.js";
import { installPackages } from "../install/install-packages.js";
import { detect } from "@antfu/ni";
import { logMessage } from "../utils/log.js";

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

  if (invalid.length) {
    // spinner.fail(
    //   `Component(s) not found: ${invalid.map((i: string) => i).join(", ")}`
    // );
    logMessage(
      "error",
      `Invalid component(s) provided: ${invalid
        .map((i: string) => i)
        .join(", ")}`
    );
    return process.exit(1);
  }

  if (!config.components.directory) {
    logMessage("error", "No component directory detected");
    return process.exit(1);
  }

  // console.log("components", components);
  const valid = components.filter((c: string) => {
    if (config && config.components && config.components.installed) {
      if (config.components.installed.includes(c)) {
        logMessage("warning", `Skipping ${c} - already installed`);
        return false;
      }
    }
    return true;
  });

  const promiseArr = valid.map((item: string) => getComponentData(item));
  const results = await Promise.all(promiseArr);
  const targetDir = `${cwd}/${config.components.directory}`;

  const existingArr = results.filter((result) => {
    // check for already existing files not created via elements
    const p = path.resolve(targetDir, result.filename);
    const exists = existsSync(p);

    if (exists) {
      return true;
    } else {
      return false;
    }
  });

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

  const externalDependencies = results.reduce((prev, curr) => {
    if (curr.dependencies.external) {
      return [...prev, ...curr.dependencies.external];
    }

    return prev;
  }, []);

  const packageManager = await detect({ programmatic: true, cwd: cwd });

  if (externalDependencies && externalDependencies.length) {
    await installPackages(externalDependencies, packageManager);
  }

  const installed = await Promise.all(
    results.map((result) => installComponent(result, targetDir))
  );

  const updatedConfig = {
    ...config,
    components: {
      ...config.components,
      installed: [
        ...config.components.installed,
        ...installed.map((i) => i.toLowerCase()),
      ],
    },
  };

  await fs.writeFile(
    `${cwd}/elements-config.json`,
    JSON.stringify(updatedConfig, null, 2),
    "utf8"
  );

  return process.exit(0);
};
