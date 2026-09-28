import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CATALOG_COLUMNS, rowToProduct } from "./from-row.ts";

const base = {
  id: "00000000-0000-4000-8000-000000000001",
  name: "בדיקה",
  description: null,
  price: 10,
  category: "tools",
  brand: "x",
  image: null,
  active: true,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
  slug: "stock-visibility",
  sku: null,
  sub: null,
  compare_at: null,
  unit: "יח׳",
  variant_hint: null,
  metadata: {},
  availability: "in",
};

describe("catalog stock visibility", () => {
  it("does not select the stock column", () => {
    assert.equal(CATALOG_COLUMNS.split(",").includes("stock"), false);
    assert.equal(CATALOG_COLUMNS.split(",").includes("availability"), true);
  });

  it("returns only in/low/out and drops an exact quantity", () => {
    const product = rowToProduct({ ...base, availability: "low", stock: 37 } as never);
    assert.ok(product);
    assert.equal(product.stock, "low");
    assert.equal(JSON.stringify(product).includes("37"), false);
    assert.equal(rowToProduct({ ...base, availability: "37" })?.stock, "out");
    assert.equal(rowToProduct({ ...base, availability: "in" })?.stock, "in");
    assert.equal(rowToProduct({ ...base, availability: "out" })?.stock, "out");
  });
});
