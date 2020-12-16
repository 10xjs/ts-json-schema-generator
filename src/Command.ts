import * as clipanion from "clipanion";
import { Context } from "./Context";

export abstract class Command extends clipanion.Command<Context> {
  abstract execute(): Promise<number>;
}
