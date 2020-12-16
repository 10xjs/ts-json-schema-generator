import * as path from "path";
import chalk from "chalk";

declare const _MANIFEST_: { name: string; version: string; binName: string };

export const manifest =
  typeof _MANIFEST_ !== "undefined"
    ? _MANIFEST_
    : {
        name: chalk.red("DEV BUILD"),
        version: undefined,
        binName: chalk.red(path.relative(process.cwd(), __filename)),
      };
