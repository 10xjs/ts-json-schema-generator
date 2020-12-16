import chalk from "chalk";
import * as Diff from "diff";

export function formatPatch(filename: string, to: string, from?: string) {
  let patch = Diff.createPatch(filename, from ?? "", to);

  if (from === undefined) {
    patch = patch
      .replace(/^@@ -1,0 /m, "@@ 0,0 ")
      .replace(/@@\n\\ No newline at end of file\n/, "@@\n");
  }

  const lines = patch.split("\n").slice(2);

  if (from === undefined) {
    lines[0] = "--- /dev/null";
  }

  const header = lines.splice(0, 2);

  return header
    .map((line) => {
      return chalk.bold(line);
    })
    .concat(
      lines.map((line) => {
        if (/^@@ /.test(line)) {
          return chalk.blue(line);
        }

        if (/^\+/.test(line)) {
          return chalk.green(line);
        }

        if (/^-/.test(line)) {
          return chalk.red(line);
        }

        return line;
      })
    )
    .join("\n");
}
