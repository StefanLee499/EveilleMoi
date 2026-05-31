import { notFound } from "next/navigation";
import { getArticle, getPublishedArticles } from "@/lib/store";
import ArticleClient from "./ArticleClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const a = await getArticle(params.slug);
  return { title: a ? `${a.title} — EveilleMoi` : "Article" };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const a = await getArticle(params.slug);
  if (!a || a.published === false) notFound();
  const all = await getPublishedArticles();
  const related = all.filter((x) => x.slug !== a.slug).slice(0, 2);

  return <ArticleClient article={a} related={related} />;
}
