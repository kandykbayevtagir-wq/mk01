// Static export for GitHub Pages.
// The /api/leads route needs a server, so it is moved into a private
// folder (ignored by the router) for the duration of the build, then restored.
import { execSync } from "node:child_process";
import { existsSync, renameSync, rmSync } from "node:fs";

const api = "src/app/api";
const parked = "src/app/_api-disabled-for-static-export";

// Fresh build dir: stale route types from `next dev` would reference the parked route.
rmSync(".next", { recursive: true, force: true });
if (existsSync(api)) renameSync(api, parked);
try {
  execSync("next build", { stdio: "inherit", env: { ...process.env, STATIC_EXPORT: "true" } });
} finally {
  if (existsSync(parked)) renameSync(parked, api);
}
