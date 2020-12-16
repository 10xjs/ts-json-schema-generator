import * as ts from "typescript";

export function getSourceFile(node: ts.Node): ts.SourceFile {
  if (ts.isSourceFile(node)) {
    return node;
  }

  return getSourceFile(node.parent);
}

export function getSourceFiles(nodes: ts.Node[]) {
  return nodes
    .map((node) => {
      return getSourceFile(node);
    })
    .filter((file, index, array) => {
      return array.indexOf(file) === index;
    });
}

export function findConfigFile(context: string) {
  return ts.findConfigFile(context, ts.sys.fileExists, "tsconfig.json");
}
