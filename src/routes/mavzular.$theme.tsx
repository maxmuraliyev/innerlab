import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ArticleCard } from "@/components/ArticleCard";
import { categories } from "@/data/articles";
import { listArticles } from "@/lib/content.functions";

export const Route = createFileRoute("/mavzular/$theme")({
  loader: async ({ params }) => {
    const decodedTheme = decodeURIComponent(params.theme).toLowerCase();
    const themeParam = decodedTheme.replace(/\s+/g, '-');
    const category = categories.find((c) => c.slug === themeParam || c.slug === decodedTheme || c.name.toLowerCase() === decodedTheme || c.slug === params.theme);
    if (!category) throw notFound();
    const articles = await listArticles({ data: { category: category.name } });
    return { category, articles };
  },
  component: ThemePage,
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    return {
      meta: [
        { title: `${loaderData.category.name} — Inner Lab` },
        { name: "description", content: loaderData.category.desc },
      ],
    };
  },
});

function ThemePage() {
  const { category, articles } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-cream text-ink/90">
      <SiteNav />
      <header className="mx-auto max-w-7xl px-6 pt-20 pb-12">
        <span className="eyebrow text-green">Mavzu</span>
        <h1 className="mt-4 font-serif text-5xl text-ink md:text-6xl">{category.name}</h1>
        <p className="mt-6 max-w-2xl text-xl text-ink/70">{category.desc}</p>
        <div className="mt-8 h-1 w-20 bg-green" />
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        {articles.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a: any) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        ) : (
          <p className="text-lg text-ink/50">Hozircha ushbu mavzuda maqolalar yo'q.</p>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
