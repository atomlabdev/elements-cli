import { Command } from "commander";
import path, { resolve } from "path";
import { existsSync, promises as fs } from "fs";
import ora from "ora";
import prompts from "prompts";

// check component exists in registry [D]
// fetch component [D]
// ask user what directory they want to install component in [D]
// overwrite check
// write component to directory [D]

// no one command install for multiple components - for now internal dependencies must also be instlled in same command ie. npx elements add button button-group

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

export const add = new Command()
  .name("add")
  .description("add a component to your project")
  .action(async (components, opts) => {
    const cwd = process.cwd();
    const dir = await fs.readdir(cwd);

    let defaultDir = "src/components";

    if (dir.includes("components")) {
      defaultDir = "components";
    }

    const response = await prompts({
      type: "text",
      name: "path",
      message: "Where would you like to install the component(s)?",
      initial: defaultDir,
    });

    if (response && response.path) {
      if (!existsSync(response.path)) {
        const createPath = await prompts({
          type: "confirm",
          name: "value",
          message: "Directory doesn't exist - do you want to create it?",
          initial: true,
        });

        if (createPath && createPath.value) {
          await fs.mkdir(response.path, { recursive: true });
        } else {
          return process.exit(1);
        }
      }

      // const spinner = ora(`Installing components...`).start();
      const { args } = opts;
      const registry = await fetch(
        "https://elements.atomlab.dev/registry/components.json"
      );
      const registryData: any = await registry.json();
      const registryComponents = registryData.map((c: any) => c.slug);
      const invalid = args.filter(
        (c: string) => !registryComponents.includes(c)
      );
      const valid = args.filter((c: string) => registryComponents.includes(c));

      if (invalid.length) {
        // spinner.fail(
        //   `Component(s) not found: ${invalid.map((i: string) => i).join(", ")}`
        // );
        process.exit(1);
      }

      const promiseArr = valid.map((item: string) => getComponentData(item));
      const results = await Promise.all(promiseArr);
      const cwd = path.resolve(process.cwd());
      const targetDir = `${cwd}/${response.path}`;

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
      // spinner.succeed(`Done.`);
    } else {
      return process.exit(1);
    }
  });
