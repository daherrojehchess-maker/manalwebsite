import { complementsFor, getProducts, toCard } from "@/lib/catalog";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const ids = (params.get("ids") ?? "").split(",").filter(Boolean).slice(0, 100);
  const list = await getProducts(ids);
  const items = list.map((p) => ({ ...toCard(p), sku: p.sku, options: p.options ?? [] }));

  let suggestions: ReturnType<typeof toCard>[] = [];
  if (params.get("suggest")) {
    const seen = new Set(ids);
    for (const p of list) {
      for (const c of await complementsFor(p, 4)) {
        if (!seen.has(c.id) && c.stock !== "out") {
          seen.add(c.id);
          suggestions.push(toCard(c));
        }
      }
    }
    suggestions = suggestions.slice(0, 8);
  }
  return Response.json({ items, suggestions }, { headers: { "Cache-Control": "no-store" } });
}
