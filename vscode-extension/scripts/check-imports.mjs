import fs from "node:fs/promises";
import path from "node:path";
import { init, parse } from "es-module-lexer";
import { json, root, writeJSON } from "./common.mjs";

const manifest = await json(path.join(root, "recovery-manifest.json"));
const missing = [],
  external = [];
let nonliteralDynamicImports = 0,
  importMetaExpressions = 0,
  literalImports = 0,
  imports = 0;
for (const record of manifest.webview) {
  for (const dependency of record.dependencies) {
    imports++;
    const specifier = dependency.specifier;
    if (specifier === null) {
      if (dependency.dynamic) nonliteralDynamicImports++;
      else importMetaExpressions++;
      continue;
    }
    literalImports++;
    if (!specifier.startsWith(".")) {
      external.push({ from: record.relative, specifier });
      continue;
    }
    const target = path.resolve(
      path.dirname(path.join(root, record.relative)),
      specifier.split(/[?#]/)[0],
    );
    // Imports may name static assets which are retained in the materialized build.
    const buildTarget = path.resolve(
      root,
      "build/extension",
      record.relative.slice(4),
      "..",
      specifier.split(/[?#]/)[0],
    );
    try {
      await fs.access(target);
    } catch {
      try {
        await fs.access(buildTarget);
      } catch {
        missing.push({ from: record.relative, specifier });
      }
    }
  }
}
// Also parse current overrides: the recovery manifest describes the original release only.
await init;
let overrideFiles = 0;
async function checkOverrides(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await checkOverrides(filename);
      continue;
    }
    if (!entry.name.endsWith(".js")) continue;
    overrideFiles++;
    const [dependencies] = parse(await fs.readFile(filename, "utf8"));
    for (const dependency of dependencies) {
      if (!dependency.n?.startsWith(".")) continue;
      const target = path.resolve(
        root,
        "build/extension",
        path.relative(path.join(root, "overrides"), path.dirname(filename)),
        dependency.n.split(/[?#]/)[0],
      );
      try {
        await fs.access(target);
      } catch {
        missing.push({
          from: path.relative(root, filename),
          specifier: dependency.n,
        });
      }
    }
  }
}
try {
  await checkOverrides(path.join(root, "overrides/webview"));
} catch (e) {
  if (e.code !== "ENOENT") throw e;
}
const report = {
  overrideFiles,
  files: manifest.webview.length,
  lexerRecords: imports,
  literalImports,
  nonliteralDynamicImports,
  importMetaExpressions,
  external,
  missing,
};
await writeJSON(path.join(root, "reports/imports.json"), report);
console.log(JSON.stringify(report, null, 2));
if (missing.length) process.exitCode = 1;
