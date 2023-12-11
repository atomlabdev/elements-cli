#! /usr/bin/env node

import { Command } from "commander";
import figlet from "figlet";
import fs from "fs";
import path from "path";

import { add } from "./commands/add.js";

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

async function main() {
  console.log(figlet.textSync("Elements"));

  const program = new Command()
    .name("Elements")
    .description("Install Elements components in your React Native project")
    .version("0.1.0", "-v, --version", "display the version number");

  program.addCommand(add);

  program.parse();
}

main();
