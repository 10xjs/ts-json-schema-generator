import * as path from "path";

export function contains(from: string, to: string) {
  const relative = path.relative(from, to);
  return !relative.startsWith("..") && !path.isAbsolute(relative);
}

export function getRootContext(paths: string[]) {
  if (paths.length === 0) {
    throw new TypeError("Empty array");
  }

  if (paths.length === 1) {
    return path.dirname(paths[0]);
  }

  return paths.reduce((a, b) => {
    while (a !== b) {
      if (a.length > b.length) {
        a = path.dirname(a);
      } else {
        b = path.dirname(b);
      }
    }
    return a;
  });
}
