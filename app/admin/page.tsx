import { redirect } from "next/navigation";
import { currentSession } from "@/lib/auth";
import { getArticles, getProducts, getServices } from "@/lib/store";
import AdminClient from "./AdminClient";

export const metadata = { title: "Admin — EveilleMoi" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const sess = currentSession();
  if (!sess) redirect("/login?next=/admin");
  if (sess.role !== "admin") redirect("/account");

  const [services, products, articles] = await Promise.all([
    getServices(),
    getProducts(),
    getArticles(),
  ]);

  return <AdminClient services={services} products={products} articles={articles} />;
}
