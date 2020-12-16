import * as clipanion from "clipanion";

interface Config extends clipanion.BaseContext, clipanion.CliOptions {
  cwd: string;
}

export class Context implements Config {
  constructor(private readonly config: Config) {}

  get cwd() {
    return this.config.cwd;
  }

  get stdin() {
    return this.config.stdin;
  }

  get stdout() {
    return this.config.stdout;
  }

  get stderr() {
    return this.config.stderr;
  }

  get binaryLabel() {
    return this.config.binaryLabel;
  }

  get binaryName() {
    return this.config.binaryName;
  }

  get binaryVersion() {
    return this.config.binaryVersion;
  }

  get enableColors() {
    return this.config.enableColors;
  }
}
