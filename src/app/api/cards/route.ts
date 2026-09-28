import { getProducts, toCard } from "@/lib/catalog";

export async function GET(request: Request) {
  const ids = (new URL(request.url).searchParams.get("ids") ?? "").split(",").filter(Boolean).slice(0, 50);
  return Response.json((await getProducts(ids)).map(toCard), {
    headers: { "Cache-Control": "no-store" },
  });
}
