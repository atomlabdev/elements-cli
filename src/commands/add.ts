import { Command } from "commander";
import path, { resolve } from "path";
import { existsSync, promises as fs } from "fs";
import ora from "ora";

// check component exists in registry [D]
// fetch component [D]
// ask user what directory they want to install component in
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
    const { args } = opts;

    // const result = await fetch(
    //   `https://elements.atomlab.dev/registry/${component}.json`
    // );
    // const json: any = await result.json();

    const spinner = ora(`Installing components...`).start();

    const registry = await fetch(
      "https://elements.atomlab.dev/registry/components.json"
    );
    const registryData: any = await registry.json();
    const registryComponents = registryData.map((c: any) => c.slug);

    const invalid = args.filter((c: string) => !registryComponents.includes(c));
    const valid = args.filter((c: string) => registryComponents.includes(c));

    console.log("invalid", invalid);

    if (invalid.length) {
      spinner.fail(
        `Component(s) not found: ${invalid.map((i: string) => i).join(", ")}`
      );
      process.exit(1);
    }

    const promiseArr = valid.map((item: string) => getComponentData(item));
    const results = await Promise.all(promiseArr);
    const cwd = path.resolve(process.cwd());
    const targetDir = cwd + "/test/components/";

    if (!existsSync(targetDir)) {
      await fs.mkdir(targetDir, { recursive: true });
    }

    results.forEach(async (result) => {
      if (result.install) {
        let filePath = path.resolve(targetDir, result.filename);
        await fs.writeFile(filePath, JSON.parse(result.install));
      }
    });

    spinner.succeed(`Done.`);

    // console.log("json", json);

    // if (json.install) {
    //   const cwd = path.resolve(process.cwd());
    //   const targetDir = cwd + "/test/components/";
    //   let filePath = path.resolve(targetDir, `${component}.tsx`);

    //   if (!existsSync(targetDir)) {
    //     await fs.mkdir(targetDir, { recursive: true });
    //   }

    //   await fs.writeFile(filePath, JSON.parse(json.install));

    //   spinner.succeed(`Done.`);
    // } else {
    //   process.exit(1);
    // }

    // try {
    //   const c = await fetch(
    //     "https://elements.atomlab.dev/registry/checkbox.json"
    //   );
    //   const json: any = await c.json();

    //   console.log("C", json);

    //   const cwd = path.resolve(process.cwd());
    //   const targetDir = cwd + "/test/components/";
    //   let filePath = path.resolve(targetDir, "test.tsx");

    //   console.log("cwd", cwd);

    //   const spinner = ora(`Installing components...`).start();

    //   spinner.text = `Installing test...`;

    //   if (!json || !json.install) {
    //     process.exit(1);
    //   }

    //   if (!existsSync(targetDir)) {
    //     await fs.mkdir(targetDir, { recursive: true });
    //   }

    //   await fs.writeFile(filePath, JSON.parse(json.install));

    //   spinner.succeed(`Done.`);
    // } catch (e) {
    //   process.exit(1);
    // }
  });
