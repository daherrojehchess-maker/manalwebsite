import { loadActiveProducts } from "@/lib/catalog";
import { suggest } from "@/lib/search";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q") ?? "";
  const catalog = await loadActiveProducts();
  return Response.json(suggest(q.slice(0, 80), catalog), {
    headers: { "Cache-Control": "no-store" },
  });
}
