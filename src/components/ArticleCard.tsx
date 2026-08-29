import { Link } from "@tanstack/react-router";
import type { Article } from "@/data/articles";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="group">
      <Link to="/articles/$slug" params={{ slug: article.slug }} className="block">
        <div className="mb-6 aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
          <img
            src={(article as any).image_url || article.image}
            alt={article.title}
            loading="lazy"
            width={1024}
            height={768}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
        <div className="space-y-3">
          <span className="eyebrow text-green">{article.category}</span>
          <h3 className="font-serif text-2xl leading-tight transition-colors group-hover:text-green">
            {article.title}
          </h3>
          <p className="line-clamp-2 text-sm text-ink/60">{article.excerpt}</p>
          <p className="text-xs text-ink/40">
            {article.date || ((article as any).created_at ? new Date((article as any).created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "")} · {article.readingTime || (article as any).reading_time}
          </p>
        </div>
      </Link>
    </article>
  );
}
