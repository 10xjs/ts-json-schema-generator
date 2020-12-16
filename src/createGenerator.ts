import * as tsj from "ts-json-schema-generator";
import * as ts from "typescript";
import { symbolAtNode } from "ts-json-schema-generator/dist/src/Utils/symbolAtNode";

(tsj as any).SchemaGenerator.prototype.getFullName = function (
  node: ts.Node,
  typeChecker: ts.TypeChecker
): string {
  const symbol = symbolAtNode(node) as ts.Symbol;
  return typeChecker.getFullyQualifiedName(symbol);
};

(tsj as any).ExposeNodeParser.prototype.getDefinitionName = function (
  node: ts.Node,
  context: tsj.Context
): string {
  const symbol = symbolAtNode(node) as ts.Symbol;
  const fullName: string = this.typeChecker.getFullyQualifiedName(symbol);
  const argumentIds = context.getArguments().map((arg) => arg?.getName());

  return argumentIds.length > 0
    ? `${fullName}<${argumentIds.join(",")}>`
    : fullName;
};

export function createGenerator(config: tsj.Config) {
  return tsj.createGenerator(config);
}
