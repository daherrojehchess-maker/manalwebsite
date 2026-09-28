import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { passwordResetRedirectTo } from "./reset-redirect.ts";

describe("passwordResetRedirectTo", () => {
  it("uses the configured site in production and ignores the host", () => {
    const url = passwordResetRedirectTo({
      isProduction: true,
      siteUrl: "https://shop.example.co.il",
      host: "evil.com",
    });
    assert.equal(url, "https://shop.example.co.il/auth/confirm?next=%2Freset-password");
  });

  it("keeps localhost development on the local origin", () => {
    const url = passwordResetRedirectTo({
      isProduction: false,
      siteUrl: "https://shop.example.co.il",
      host: "localhost:3000",
    });
    assert.equal(url, "http://localhost:3000/auth/confirm?next=%2Freset-password");
  });

  it("does not follow a non-local host during development", () => {
    const url = passwordResetRedirectTo({
      isProduction: false,
      siteUrl: "https://shop.example.co.il/",
      host: "evil.com",
    });
    assert.equal(url, "https://shop.example.co.il/auth/confirm?next=%2Freset-password");
  });
});
