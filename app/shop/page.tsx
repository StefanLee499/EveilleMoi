import { getPublishedProducts } from "@/lib/store";
import ShopClient from "./ShopClient";

export const metadata = { title: "Shop — EveilleMoi" };
export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await getPublishedProducts();
  return <ShopClient products={products} />;
}
