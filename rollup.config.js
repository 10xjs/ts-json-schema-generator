// eslint-disable-next-line
import resolve from "@rollup/plugin-node-resolve";
import path from "path";
import fs from "fs";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import license from "rollup-plugin-license";
import replace from "@rollup/plugin-replace";

const { name, version, bin } = require("./package.json");
const binName = Object.keys(bin)[0];

export default {
  input: "dist/index.js",
  output: {
    file: "index.js",
    format: "cjs",
    strict: false,
    banner: "#! /usr/bin/env node\n",
    preferConst: true,
    exports: "default",
  },
  external: [
    "typescript",
    "diff",
    "assert",
    "fs",
    "path",
    "os",
    "tty",
    "events",
    "util",
  ],
  plugins: [
    resolve(),
    json(),
    commonjs(),
    replace({
      values: {
        _MANIFEST_: JSON.stringify({ name, version, binName }),
      },
    }),
    license({
      thirdParty: {
        output: {
          file: path.join(__dirname, "LICENSE.md"),
          template(dependencies) {
            const core = fs.readFileSync(
              path.join(__dirname, "LICENSE-CORE.md"),
              "utf-8"
            );

            const sorted = dependencies.sort(
              ({ name: nameA }, { name: nameB }) => {
                return nameA > nameB ? 1 : -1;
              }
            );

            const licenses = new Set(sorted.map(({ license }) => license));

            const text = sorted
              .map(
                ({
                  name,
                  license,
                  licenseText,
                  author,
                  maintainers,
                  contributors,
                  repository,
                }) => {
                  let text = `## ${name}\n`;

                  if (license) {
                    text += `\nLicense: ${license}  `;
                  }

                  const names = new Set();

                  if (author && author.name) {
                    names.add(author.name);
                  }

                  for (const person of maintainers.concat(contributors)) {
                    if (person && person.name) {
                      names.add(person.name);
                    }
                  }

                  if (names.size > 0) {
                    text += `\nBy: ${Array.from(names).join(", ")}  `;
                  }

                  if (repository) {
                    text += `\nRepository: ${repository.url || repository}  `;
                  }

                  if (licenseText) {
                    text +=
                      "\n\n" +
                      licenseText
                        .trim()
                        .replace(/(\r\n|\r)/gm, "\n")
                        .split("\n")
                        .map((line) => `> ${line}`)
                        .join("\n");
                  }

                  return text;
                }
              )
              .join("\n\n---\n\n");

            return `# Core License

${core}
# Licenses of bundled dependencies

The published artifact additionally contains code with the following licenses: ${Array.from(
              licenses
            ).join(", ")}

# Bundled dependencies

${text}`;
          },
        },
      },
    }),
  ],
};
