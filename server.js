import { createServer, request as httpRequest } from "node:http";
import { createReadStream, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const port = Number(process.env.PORT || 8085);
const root = new URL(".", import.meta.url).pathname;
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".png": "image/png", ".woff2": "font/woff2" };
const proxies = [
  { prefix: "/cadets", origin: process.env.CADET_ORIGIN || "http://127.0.0.1:8086" },
  { prefix: "/navigators", origin: process.env.NAVIGATOR_ORIGIN || "http://127.0.0.1:8089" },
  { prefix: "/communication-officers", origin: process.env.OFFICER_ORIGIN || "http://127.0.0.1:8087" },
  { prefix: "/commanders", origin: process.env.COMMANDER_ORIGIN || "http://127.0.0.1:8088" }
];

function proxy(request, response, route, url) {
  const target = new URL(route.origin);
  const forwardedPath = url.pathname.slice(route.prefix.length) || "/";
  const upstream = httpRequest({
    hostname: target.hostname,
    port: target.port || 80,
    method: request.method,
    path: `${forwardedPath}${url.search}`,
    headers: { ...request.headers, host: target.host, "x-forwarded-prefix": route.prefix }
  }, (upstreamResponse) => {
    response.writeHead(upstreamResponse.statusCode || 502, upstreamResponse.headers);
    upstreamResponse.pipe(response);
  });
  upstream.on("error", () => response.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" }).end("Academy path is offline. Start the linked academy and try again."));
  request.pipe(upstream);
}

createServer((request, response) => {
  const url = new URL(request.url, "http://localhost");
  const route = proxies.find(({ prefix }) => url.pathname === prefix || url.pathname.startsWith(`${prefix}/`));
  if (route) {
    if (url.pathname === route.prefix) {
      response.writeHead(301, { Location: `${route.prefix}/${url.search}` }).end();
      return;
    }
    proxy(request, response, route, url);
    return;
  }

  const pathname = decodeURIComponent(url.pathname);
  const relative = normalize(pathname === "/" ? "index.html" : pathname.slice(1));
  const file = join(root, relative);
  if (!file.startsWith(root)) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  try {
    if (!statSync(file).isFile()) throw new Error("not a file");
    response.writeHead(200, { "Content-Type": `${types[extname(file)] || "application/octet-stream"}; charset=utf-8`, "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
    createReadStream(file).pipe(response);
  } catch {
    if (["GET", "HEAD"].includes(request.method)) {
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
      createReadStream(join(root, "index.html")).pipe(response);
    } else {
      response.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
    }
  }
}).listen(port, "0.0.0.0", () => console.log(`AppSec Community Academy online at http://localhost:${port}`));
