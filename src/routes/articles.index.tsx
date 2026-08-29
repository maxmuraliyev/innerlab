import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ArticleCard } from "@/components/ArticleCard";
import { listArticles } from "@/lib/content.functions";

export const Route = createFileRoute("/articles/")({
  loader: async () => {
    return await listArticles();
  },
  component: ArticlesPage,
  head: () => ({
    meta: [
      { title: "Articles — Inner Lab" },
      {
        name: "description",
        content:
          "Inner Lab articles and research analysis on psychology, sleep, habits, education, and decision making.",
      },
      { property: "og:title", content: "Articles — Inner Lab" },
      {
        property: "og:description",
        content: "A collection of analytical articles on human behavior and well-being.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/articles" },
    ],
    links: [{ rel: "canonical", href: "/articles" }],
  }),
});

function ArticlesPage() {
  const articles = Route.useLoaderData();
  
  return (
    <div className="min-h-screen bg-cream text-ink/90">
      <SiteNav />
      <header className="mx-auto max-w-7xl px-6 pt-20 pb-12">
        <span className="eyebrow text-green">Archive</span>
        <h1 className="mt-4 font-serif text-5xl text-ink md:text-6xl">Articles</h1>
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
