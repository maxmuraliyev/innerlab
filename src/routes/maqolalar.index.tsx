import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ArticleCard } from "@/components/ArticleCard";
import { listArticles } from "@/lib/content.functions";

export const Route = createFileRoute("/maqolalar/")({
  loader: async () => {
    return await listArticles();
  },
  component: ArticlesPage,
  head: () => ({
    meta: [
      { title: "Maqolalar — Inner Lab" },
      {
        name: "description",
        content:
          "Psixologiya, uyqu, odatlar, ta’lim va qaror qabul qilish haqida Inner Lab maqolalari va tadqiqot tahlillari.",
      },
      { property: "og:title", content: "Maqolalar — Inner Lab" },
      {
        property: "og:description",
        content: "Inson xulqi va farovonligi haqida tahliliy maqolalar to‘plami.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/maqolalar" },
    ],
    links: [{ rel: "canonical", href: "/maqolalar" }],
  }),
});

function ArticlesPage() {
  const articles = Route.useLoaderData();
  
  return (
    <div className="min-h-screen bg-cream text-ink/90">
      <SiteNav />
      <header className="mx-auto max-w-7xl px-6 pt-20 pb-12">
        <span className="eyebrow text-green">Arxiv</span>
        <h1 className="mt-4 font-serif text-5xl text-ink md:text-6xl">Maqolalar</h1>
        <div className="mt-6 h-1 w-20 bg-green" />
      </header>
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a: any) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
