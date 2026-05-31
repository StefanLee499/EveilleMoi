import { getPublishedArticles as getArticles } from "@/lib/store";
import BlogListClient from "./BlogListClient";

export const metadata = { title: "Journal — EveilleMoi" };
export const dynamic = "force-dynamic";

const categories = ["All", "Wellness", "Astrology", "Lifestyle", "Reflections"] as const;

export default async function BlogPage({ searchParams }: { searchParams: { c?: string } }) {
  const articles = await getArticles();
  const active = (searchParams.c as (typeof categories)[number]) || "All";
  return <BlogListClient articles={articles} active={active} />;
}
