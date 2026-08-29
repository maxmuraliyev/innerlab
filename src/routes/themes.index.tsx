import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { categories } from "@/data/articles";
import { listArticles } from "@/lib/content.functions";

export const Route = createFileRoute("/themes/")({
  loader: async () => {
    return await listArticles();
  },
  component: TopicsPage,
  head: () => ({
    meta: [
      { title: "Themes — Inner Lab" },
      {
        name: "description",
        content:
          "Psychology, well-being, education, sleep and stress, character, personal development and decisions — Inner Lab themes.",
      },
      { property: "og:title", content: "Themes — Inner Lab" },
      {
        property: "og:description",
        content: "The seven main areas explored by Inner Lab.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/themes" },
    ],
    links: [{ rel: "canonical", href: "/themes" }],
  }),
});

function TopicsPage() {
  const articles = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-cream text-ink/90">
      <SiteNav />
      <header className="mx-auto max-w-7xl px-6 pt-20 pb-12">
        <span className="eyebrow text-green">Directions</span>
        <h1 className="mt-4 font-serif text-5xl text-ink md:text-6xl">Themes</h1>
        <div className="mt-6 h-1 w-20 bg-green" />
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const count = articles.filter((a: any) => a.category === c.name).length;
            return (
              <Link
                key={c.slug}
                to="/themes/$theme"
                params={{ theme: c.slug }}
                className="group rounded-2xl border border-ink/10 bg-white p-8 shadow-sm transition-all hover:border-green/30 hover:shadow-md"
              >
                <h2 className="font-serif text-2xl text-ink group-hover:text-green">{c.name}</h2>
                <p className="mt-2 text-sm text-ink/60">{c.desc}</p>
                <p className="mt-6 text-xs text-ink/40">{count} articles</p>
              </Link>
            );
          })}
        </div>
        <div className="mt-12">
          <Link to="/articles" className="eyebrow border-b-2 border-green pb-1 hover:text-green">
            All articles
          </Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
