import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isValidPassword, PASSWORD_MIN_LENGTH, PASSWORD_RESET_ACK, PASSWORD_TOO_SHORT } from "./errors.ts";

describe("password policy", () => {
  it("requires 12 characters for new passwords", () => {
    assert.equal(PASSWORD_MIN_LENGTH, 12);
    assert.equal(isValidPassword("a".repeat(11)), false);
    assert.equal(isValidPassword("a".repeat(12)), true);
    assert.match(PASSWORD_TOO_SHORT, /12/);
  });

  it("uses one generic password-reset acknowledgement", () => {
    assert.match(PASSWORD_RESET_ACK, /אם קיים חשבון/);
    assert.equal(PASSWORD_RESET_ACK.includes("לא נמצא"), false);
    assert.equal(PASSWORD_RESET_ACK.includes("רשומ"), false);
  });
});
