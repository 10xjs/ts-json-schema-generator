import { Cli } from "./Cli";
import { Context } from "./Context";
import { manifest } from "./manifest";

void Cli.run(
  process.argv.slice(2),
  new Context({
    binaryLabel: manifest.name,
    binaryVersion: manifest.version,
    binaryName: manifest.binName,
    enableColors: true,
    cwd: process.cwd(),
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: process.stderr,
  })
).then((exitCode) => {
  process.exitCode = exitCode;
});
