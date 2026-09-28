import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { safeRedirectPath, signupConfirmRedirectTo } from "./safe-redirect.ts";

describe("safeRedirectPath", () => {
  it("allows internal account and checkout paths", () => {
    assert.equal(safeRedirectPath("/account"), "/account");
    assert.equal(safeRedirectPath("/checkout"), "/checkout");
    assert.equal(safeRedirectPath("/checkout?x=1"), "/checkout?x=1");
  });

  it("rejects protocol-relative, absolute, and malformed targets", () => {
    assert.equal(safeRedirectPath("//evil.com"), "/account");
    assert.equal(safeRedirectPath("https://evil.com"), "/account");
    assert.equal(safeRedirectPath("http://evil.com"), "/account");
    assert.equal(safeRedirectPath("/%"), "/account");
    assert.equal(safeRedirectPath("/%E0%A4%A"), "/account");
    assert.equal(safeRedirectPath("/\\evil.com"), "/account");
    assert.equal(safeRedirectPath("/%2F%2Fevil.com"), "/account");
    assert.equal(safeRedirectPath("/%5Cevil.com"), "/account");
    assert.equal(safeRedirectPath("javascript:alert(1)"), "/account");
    assert.equal(safeRedirectPath(null), "/account");
  });
});

describe("signupConfirmRedirectTo", () => {
  it("uses the localhost site url for confirmation", () => {
    const url = signupConfirmRedirectTo({
      siteUrl: "http://localhost:3000",
      next: "/account",
      host: "evil.com",
    });
    assert.equal(url, "http://localhost:3000/auth/confirm?next=%2Faccount");
  });

  it("uses the configured site url and ignores the host", () => {
    const url = signupConfirmRedirectTo({
      siteUrl: "https://shop.example.co.il/",
      next: "/account",
      host: "evil.com",
    });
    assert.equal(url, "https://shop.example.co.il/auth/confirm?next=%2Faccount");
  });

  it("sends confirmation to /account and rejects external next values", () => {
    assert.equal(safeRedirectPath("/account", "/reset-password"), "/account");
    for (const next of ["https://evil.com", "http://evil.com", "//evil.com", "/\\evil.com", "/%2F%2Fevil.com"]) {
      assert.equal(
        signupConfirmRedirectTo({ siteUrl: "http://localhost:3000", next, host: "evil.com" }),
        "http://localhost:3000/auth/confirm?next=%2Faccount",
      );
      assert.equal(safeRedirectPath(next, "/reset-password"), "/reset-password");
    }
  });
});
