import { execSync } from "node:child_process";

const allowed = {
  // No patched braces exists (every version is affected). It only reaches the
  // Studio through @sanity/cli's file watcher and globbing at build time, and
  // `npm audit fix --force` would downgrade sanity to 5.7.0. Drop this entry
  // once braces ships a fix.
  "GHSA-vfj7-8cjw-p6xm": "braces stack-exhaustion DoS",
};

const blocking = new Set(["moderate", "high", "critical"]);

let output;
try {
  output = execSync("npm audit --json", {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
} catch (error) {
  output = error.stdout;
}

const report = JSON.parse(output);
const advisories = new Map();
for (const vulnerability of Object.values(report.vulnerabilities ?? {})) {
  for (const via of vulnerability.via) {
    if (typeof via !== "object" || !blocking.has(via.severity)) continue;
    const id = via.url.split("/").pop();
    advisories.set(id, `${via.name} (${via.severity}): ${via.title} ${via.url}`);
  }
}

const unexpected = [...advisories].filter(([id]) => !(id in allowed));
for (const [id] of advisories) {
  if (id in allowed) console.log(`allowed ${id}: ${allowed[id]}`);
}
const stale = Object.keys(allowed).filter((id) => !advisories.has(id));
for (const id of stale) console.log(`${id} no longer reported; remove it from scripts/audit.mjs`);

if (unexpected.length > 0) {
  for (const [, line] of unexpected) console.error(line);
  console.error(`${unexpected.length} advisory(ies) at moderate or above`);
  process.exit(1);
}
console.log("npm audit: nothing blocking");
