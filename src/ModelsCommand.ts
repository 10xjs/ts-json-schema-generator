import path from "path";
import fs from "fs";
import chalk from "chalk";
import glob from "glob";

import { createGenerator } from "./createGenerator";
import { getRootContext } from "./pathUtils";
import { findConfigFile, getSourceFiles } from "./tsUtils";
import { extractModels } from "./extractModels";

import { Command } from "./Command";
import { formatPatch } from "./formatUtils";

export class ModelsCommand extends Command {
  @Command.String()
  files!: string;

  @Command.String("-p, --project", {
    description: "Path to a valid tsconfig.json file",
  })
  project?: string | undefined;

  @Command.Boolean("-d, --dry-run", {
    description: "Preview generator output without writing changes",
  })
  dryRun: boolean = false;

  @Command.String("-o, --out", {
    description: "Redirect output structure to the directory",
  })
  out: string | undefined;

  @Command.String("-f, --file-template", {
    description: "Output filename template.",
  })
  fileTemplate: string = "[dir]/[file]_[name].schema.json";

  static usage = Command.Usage({
    description: "Generate JSON Schema models from TypeScript sources",
    details: `This command statically parses TypeScript files matching an input source glob and emits `,
    examples: [
      [
        chalk`Convert types exported from {cyan src/dir/\{file\}.ts} as {cyan src/dir/\{file\}_\{type\}.schema.json}`,
        chalk`{gray generate models 'src/dir/**/*.ts'}`,
      ],
      [
        chalk`Convert types exported from {cyan \`src/model/**/*.ts\`} to {cyan \`src/model/**/generated/*.schema.json\`}`,
        chalk`{gray generate models 'src/model/**/*.ts' -f 'generated/[file]_[name].schema.json'}`,
      ],
      [
        chalk`SConvert types exported from {cyan \`src/model/**/*.ts\`} to {cyan \`models/generated/**/*.json\`}`,
        chalk`{gray generate models 'src/model/**/*.ts' -o models/generated -f '[dir]/[file]_[name].schema.json'}`,
      ],
    ],
  });

  @Command.Path("models")
  async execute() {
    const project = this.project ?? findConfigFile(this.context.cwd);

    const files = path.resolve(this.context.cwd, this.files);

    if (glob.sync(files).length === 0) {
      this.context.stdout.write(chalk.yellow("No source files found\n"));

      return 0;
    }

    const generator = createGenerator({ path: files, tsconfig: project });

    const sourceFiles = getSourceFiles((generator as any).getRootNodes());

    const sourceFileNames = sourceFiles.map((file) => file.fileName);

    const rootContext = getRootContext(sourceFileNames);

    const combinedSchema = generator.createSchema();

    const models = extractModels(combinedSchema, this.fileTemplate);

    models.forEach(({ schema, srcPath, outPath }) => {
      const data = JSON.stringify(schema, null, 2) + "\n";

      const redirectOutPath =
        this.out === undefined
          ? outPath
          : path.join(
              path.resolve(this.context.cwd, this.out),
              path.relative(rootContext, outPath)
            );

      const exists = fs.existsSync(redirectOutPath);

      const current = exists
        ? fs.readFileSync(redirectOutPath, "utf-8")
        : undefined;

      const relativeOutPath = path.relative(this.context.cwd, redirectOutPath);
      if (current === data) {
        this.context.stdout.write(chalk`{gray unchanged ${relativeOutPath}\n}`);
      } else if (exists) {
        this.context.stdout.write(chalk`{blue modified ${relativeOutPath}\n}`);
      } else {
        this.context.stdout.write(chalk`{chalk created ${relativeOutPath}\n}`);
      }

      if (this.dryRun) {
        this.context.stdout.write(
          "\n" + formatPatch(redirectOutPath, data, current) + "\n"
        );
      } else {
        fs.mkdirSync(path.dirname(redirectOutPath), { recursive: true });
        fs.writeFileSync(redirectOutPath, data, "utf-8");
      }
    });

    return 0;
  }
}
