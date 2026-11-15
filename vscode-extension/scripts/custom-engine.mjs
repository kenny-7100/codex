import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";

// An ignored local descriptor pins the binary used by subsequent rebuilds.
export async function installCustomEngine(root, target) {
  let config;
  try {
    config = JSON.parse(
      await fs.readFile(
        path.join(root, "resources/custom-engine.json"),
        "utf8",
      ),
    );
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const input = process.env.CODEXX_ENGINE || config?.path;
  if (!input) return null;
  if (process.platform !== "darwin" || process.arch !== "arm64")
    throw new Error(
      "Custom engine packaging currently supports darwin-arm64 only",
    );
  const source = path.resolve(root, input);
  const digest = createHash("sha256");
  for await (const chunk of createReadStream(source)) digest.update(chunk);
  const sha256 = digest.digest("hex");
  if (config?.sha256 && config.sha256 !== sha256)
    throw new Error(
      "Custom engine SHA-256 differs from resources/custom-engine.json",
    );
  const version = execFileSync(source, ["--version"], {
    encoding: "utf8",
  }).trim();
  const probeHome = await fs.mkdtemp(
    path.join(process.env.TMPDIR || os.tmpdir(), "codexx-engine-probe-"),
  );
  try {
    const features = execFileSync(source, ["features", "list"], {
      encoding: "utf8",
      env: { ...process.env, CODEX_HOME: probeHome },
    });
    if (!/^persistent_provider_retries\s/m.test(features))
      throw new Error(
        "This binary does not support persistent_provider_retries",
      );
  } finally {
    await fs.rm(probeHome, { recursive: true, force: true });
  }
  const destination = path.join(target, "bin/macos-aarch64/codex");
  await fs.copyFile(source, destination);
  await fs.chmod(destination, 0o755);
  execFileSync("codesign", ["--verify", "--strict", destination]);
  return {
    sha256,
    version,
    platform: "darwin-arm64",
    persistentProviderRetries: true,
    legacyThreadRevert:
      config?.legacyThreadRevert === true && config?.sha256 === sha256,
    sourceRevision: config?.sourceRevision ?? null,
    sourceDiffSha256: config?.sourceDiffSha256 ?? null,
  };
}
