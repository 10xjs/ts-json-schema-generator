import * as clipanion from "clipanion";
import { Context } from "./Context";
import { ModelsCommand } from "./ModelsCommand";

export class Cli extends clipanion.Cli<Context> {
  constructor(public context: Context) {
    super(context);

    this.register(clipanion.Command.Entries.Help as any);
    this.register(clipanion.Command.Entries.Version as any);

    this.register(ModelsCommand);
  }

  static async run(input: string[], context: Context) {
    const instance = new Cli(context);

    return await instance.run(input, instance.context);
  }
}
