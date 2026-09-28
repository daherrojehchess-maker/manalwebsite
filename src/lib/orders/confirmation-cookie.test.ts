import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { checkoutConfirmCookieOptions } from "./confirmation-cookie.ts";

describe("checkout confirmation cookie", () => {
  it("is httpOnly, Lax, and limited to /checkout", () => {
    for (const isProduction of [false, true]) {
      const options = checkoutConfirmCookieOptions(isProduction);
      assert.equal(options.httpOnly, true);
      assert.equal(options.sameSite, "lax");
      assert.equal(options.path, "/checkout");
    }
  });

  it("is Secure only when the server is in production", () => {
    assert.equal(checkoutConfirmCookieOptions(false).secure, false);
    assert.equal(checkoutConfirmCookieOptions(true).secure, true);
  });
});
