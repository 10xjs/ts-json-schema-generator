import * as jsonSchema from "json-schema";

/**
 * JSON Schema v7 properties that may contain maps of embedded schemas.
 */
const SCHEMA_MAP_KEYS = [
  "properties",
  "patternProperties",
  "definitions",
] as const;

/**
 * JSON Schema v7 properties that may contain arrays embedded schemas.
 */
const SCHEMA_ARRAY_KEYS = ["items", "allOf", "anyOf", "oneOf"] as const;

/**
 * JSON Schema v7 properties that may contain directly embedded schemas.
 */
const SCHEMA_KEYS = [
  "items",
  "additionalItems",
  "propertyNames",
  "if",
  "then",
  "else",
  "not",
] as const;

export function rewriteRefs(
  schema: jsonSchema.JSONSchema7Definition,
  callback: (ref: string) => string
) {
  if (typeof schema === "boolean") {
    return;
  }

  // Process properties that may contain maps of embedded schemas.
  SCHEMA_MAP_KEYS.map((field) => {
    const map = schema[field];

    if (map === undefined || Array.isArray(map)) {
      return;
    }

    Object.values(map).forEach((embedded) => {
      rewriteRefs(embedded, callback);
    });
  });

  // Process properties that may contain arrays of embedded schemas.
  SCHEMA_ARRAY_KEYS.map((field) => {
    const embedded = schema[field];

    if (Array.isArray(embedded)) {
      embedded.forEach((embeddedSchema) => {
        rewriteRefs(embeddedSchema, callback);
      });
    }
  });

  // Process properties that may contain directly embedded schemas.
  SCHEMA_KEYS.map((field) => {
    const embedded = schema[field];

    if (embedded !== undefined && !Array.isArray(embedded)) {
      rewriteRefs(embedded, callback);
    }
  });

  if (schema.$ref === undefined) {
    return;
  }

  schema.$ref = callback(schema.$ref);
}
