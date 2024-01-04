import { detect } from "@antfu/ni";
import { getProjectDeps } from "./get-project-deps.js";

export const getInstallCommand = async () => {
  const packageManager = await detect();
  const deps = await getProjectDeps();

  if (deps && deps.includes("expo")) {
    return "npx expo install";
  }

  if (packageManager === "yarn") {
    return "yarn add";
  }

  return `${packageManager} install`;
};
