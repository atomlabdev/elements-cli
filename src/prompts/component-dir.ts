import { existsSync, promises as fs } from "fs";
import prompts from "prompts";

export const promptComponentDir = async () => {
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

    return response.path;
  } else {
    return null;
  }
};
