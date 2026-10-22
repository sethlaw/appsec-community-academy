import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const nginx = await readFile(new URL("../nginx.conf", import.meta.url), "utf8");

test("publishes all four academy paths", () => {
  for (const route of ["/cadets/", "/navigators/", "/communication-officers/", "/commanders/"]) {
    assert.match(html, new RegExp(`href=["']${route}["']`));
  }
});

test("local gateway proxies all active academies", () => {
  assert.match(nginx, /location \/cadets\//);
  assert.match(nginx, /proxy_pass http:\/\/cadet-academy\//);
  assert.match(nginx, /location \/navigators\//);
  assert.match(nginx, /proxy_pass http:\/\/navigator-academy\//);
  assert.match(nginx, /location \/communication-officers\//);
  assert.match(nginx, /proxy_pass http:\/\/officer-academy\//);
  assert.match(nginx, /location \/commanders\//);
  assert.match(nginx, /proxy_pass http:\/\/commander-academy\//);
});

test("landing page provides descriptive image text", () => {
  assert.match(html, /alt="The four academy ranks:/);
});

test("all four academy cards are open", () => {
  assert.equal((html.match(/Enrollment open/g) ?? []).length, 4);
  assert.doesNotMatch(html, /Curriculum in development/);
});
