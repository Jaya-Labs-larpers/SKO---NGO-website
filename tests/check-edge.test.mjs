import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:http";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const run = promisify(execFile);
const script = fileURLToPath(
  new URL("../scripts/check-edge.mjs", import.meta.url),
);

test("a dropped connection is retried once, then counted as a failed check", async () => {
  const requests = new Map();
  const server = createServer((request, response) => {
    const count = (requests.get(request.url) ?? 0) + 1;
    requests.set(request.url, count);
    const drop =
      request.url === "/robots.txt" ||
      (request.url === "/sitemap-index.xml" && count === 1);
    if (drop) {
      request.socket.destroy();
      return;
    }
    response.end("<html></html>");
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const base = `http://127.0.0.1:${server.address().port}`;

  try {
    const result = await run(process.execPath, [script, base]).catch(
      (error) => error,
    );
    const { stdout } = result;

    assert.equal(result.code, 1);
    assert.match(stdout, /^FAIL {2}GET \/robots\.txt responds {2}\(.+\)$/m);
    assert.equal(requests.get("/robots.txt"), 2);
    assert.match(
      stdout,
      /^INFO {2}retrying GET \/sitemap-index\.xml after .+$/m,
    );
    assert.doesNotMatch(stdout, /GET \/sitemap-index\.xml responds/);
    assert.equal(requests.get("/sitemap-index.xml"), 2);
    assert.match(
      stdout,
      /^\d+\/\d+ checks passed against http:\/\/127\.0\.0\.1:\d+$/m,
    );
  } finally {
    server.closeAllConnections();
    server.close();
  }
});

test("a homepage still pointing at the previous build is waited out", async () => {
  let homeRequests = 0;
  const server = createServer((request, response) => {
    if (request.url === "/") {
      homeRequests += 1;
      const css = homeRequests === 1 ? "Old.aaaa.css" : "New.bbbb.css";
      response.end(`<link rel="stylesheet" href="/_astro/${css}">`);
      return;
    }
    if (request.url.startsWith("/_astro/")) {
      response.writeHead(request.url.includes("New") ? 200 : 404, {
        "cache-control": "public, max-age=31536000, immutable",
      });
    }
    response.end();
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const base = `http://127.0.0.1:${server.address().port}`;

  try {
    const { stdout } = await run(process.execPath, [script, base]).catch(
      (error) => error,
    );

    assert.match(
      stdout,
      /^INFO {2}\/_astro\/Old\.aaaa\.css is 404, waiting for the deploy to settle$/m,
    );
    assert.match(
      stdout,
      /^PASS {2}hashed asset \/_astro\/New\.bbbb\.css is immutable {2}\(200 /m,
    );
  } finally {
    server.closeAllConnections();
    server.close();
  }
});
