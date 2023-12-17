export type PackageManager =
  | "npm"
  | "pnpm"
  | "yarn"
  | "yarn@berry"
  | "pnpm@6"
  | "bun"
  | null;

export const getInstallCommand = (packageManager: PackageManager) => {
  if (packageManager === "yarn") {
    return "add";
  }

  return "install";
};
