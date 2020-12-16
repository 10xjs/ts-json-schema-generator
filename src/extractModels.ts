import * as path from "path";
import * as jsonSchema from "json-schema";

import { interpolateName } from "./interpolateName";
import { rewriteRefs } from "./rewriteRefs";

export function extractModels(
  combinedSchema: jsonSchema.JSONSchema7,
  filenameTemplate: string
) {
  const schemas = new Map(
    Object.entries(combinedSchema.definitions ?? {})
      .map(([name, definition]) => {
        return [name, definition, /^"(.*)"\.(.*)$/.exec(name)] as const;
      })
      .filter((entry): entry is [
        string,
        jsonSchema.JSONSchema7,
        RegExpExecArray
      ] => {
        const [, definition, match] = entry;

        return (
          match !== null &&
          typeof definition !== "undefined" &&
          typeof definition !== "boolean"
        );
      })
      .map(([name, definition, [, srcPath, symbolName]]) => {
        const outPath = interpolateName(filenameTemplate, symbolName, srcPath);

        return [name, { definition, srcPath, outPath, symbolName }];
      })
  );

  return [...schemas.values()].map(({ outPath, definition, srcPath }) => {
    rewriteRefs(definition, (ref) => {
      const match = /^#\/definitions\/(".*"\..*)$/.exec(
        decodeURIComponent(ref)
      );

      if (match === null) {
        return ref;
      }

      const targetName = match[1];

      const targetSchema = schemas.get(targetName);

      if (targetSchema === undefined) {
        return ref;
      }

      return path.relative(path.dirname(outPath), targetSchema.outPath);
    });

    const schema = {
      $schema: combinedSchema.$schema,
      ...definition,
    };

    return { schema, outPath, srcPath };
  });
}
