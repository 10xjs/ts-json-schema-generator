import * as path from "path";

export function interpolateName(
  filenameTemplate: string,
  symbolName: string,
  srcFilename: string
) {
  const file = path.basename(srcFilename);
  const dir = path.dirname(srcFilename).replace(/^\.$|^\.\//, "");

  return filenameTemplate
    .replace(/\[dir\]/gi, dir)
    .replace(/\[file\]/gi, file)
    .replace(/\[name\]/gi, symbolName)
    .replace(/(\.+)/gi, ".")
    .replace(/(\/+)/gi, "/");
}
