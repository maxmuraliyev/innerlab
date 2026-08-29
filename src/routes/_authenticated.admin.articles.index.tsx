import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { listAllArticles, deleteArticle } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/articles/")({
  component: AdminArticles,
});

function AdminArticles() {
  const [articles, setArticles] = useState<any[] | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    listAllArticles().then(setArticles).catch(console.error);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    setDeleting(id);
    try {
      await deleteArticle({ data: { id } });
      listAllArticles().then(setArticles).catch(console.error);
    } catch (err) {
      alert("An error occurred");
    } finally {
      setDeleting(null);
    }
  };

  if (!articles) return <div className="p-8 text-ink/50">Loading...</div>;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold">Articles</h1>
        <Link
          to="/admin/articles/new"
          className="rounded-lg bg-green px-4 py-2 text-sm font-medium text-white hover:bg-green/90"
        >
          New article
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink/10 bg-ink/5">
            <tr>
              <th className="px-6 py-4 font-medium text-ink/70">Title</th>
              <th className="px-6 py-4 font-medium text-ink/70">Category</th>
              <th className="px-6 py-4 font-medium text-ink/70">Status</th>
              <th className="px-6 py-4 font-medium text-ink/70">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-cream/50">
                <td className="px-6 py-4 font-medium">{article.title}</td>
                <td className="px-6 py-4 text-ink/70">{article.category}</td>
                <td className="px-6 py-4">
                  {article.published ? (
                    <span className="inline-flex rounded-full bg-green/10 px-2.5 py-0.5 text-xs font-medium text-green">
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <Link
                      to={`/admin/articles/new`}
                      search={{ id: article.id }}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(article.id)}
                      disabled={deleting === article.id}
                      className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-ink/50">
                  No articles yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
