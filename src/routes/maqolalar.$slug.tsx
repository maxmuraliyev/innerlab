import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ArticleCard } from "@/components/ArticleCard";
import { articles, getArticle } from "@/data/articles";

export const Route = createFileRoute("/maqolalar/$slug")({
  loader: ({ params }) => {
    const article = getArticle(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  component: ArticlePage,
  head: ({ params, loaderData }) => {
    const title = loaderData ? `${loaderData.article.title} — Inner Lab` : "Maqola — Inner Lab";
    const description = loaderData?.article.excerpt ?? "Inner Lab maqolasi.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/maqolalar/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/maqolalar/${params.slug}` }],
      scripts: loaderData
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: loaderData.article.title,
                description: loaderData.article.excerpt,
                articleSection: loaderData.article.category,
              }),
            },
          ]
        : [],
    };
  },
});

function ArticlePage() {
  const { article } = Route.useLoaderData();
  const related = articles.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-cream text-ink/90">
      <SiteNav />

      <article className="mx-auto max-w-3xl px-6 pt-16 pb-20">
        <Link to="/maqolalar" className="eyebrow text-green hover:opacity-70">
          ← Maqolalar
        </Link>
        <h1 className="mt-6 font-serif text-4xl leading-tight text-ink md:text-5xl">
          {article.title}
        </h1>
        <p className="mt-4 text-sm text-ink/50">
          {article.category} · {article.date} · {article.readingTime}
        </p>
        <img
          src={article.image}
          alt={article.title}
          width={1024}
          height={768}
          className="mt-10 aspect-[16/10] w-full rounded-2xl object-cover"
        />
        <div className="mt-10 space-y-6 text-lg leading-relaxed text-ink/80">
          {article.body.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </article>

      <section className="mx-auto max-w-7xl border-t border-ink/10 px-6 py-20">
        <h2 className="mb-12 font-serif text-3xl text-ink">Yana o‘qing</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {related.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
