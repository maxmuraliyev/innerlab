import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { saveArticle, listAllArticles } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { categories } from "@/data/articles";
import { z } from "zod";

export const Route = createFileRoute("/_authenticated/admin/articles/new")({
  validateSearch: (search) =>
    z
      .object({
        id: z.string().uuid().optional(),
      })
      .parse(search),
  component: AdminArticleForm,
});

function AdminArticleForm() {
  const { id } = Route.useSearch();
  const navigate = useNavigate();
  const [existing, setExisting] = useState<any>(undefined); // undefined = loading
  
  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: categories[0]?.name || "",
    excerpt: "",
    body: "",
    reading_time: "5 daqiqa",
    published: true,
    image_url: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      listAllArticles().then(all => {
        const article = all.find(a => a.id === id);
        setExisting(article || null);
        if (article) {
          setForm({
            title: article.title || "",
            slug: article.slug || "",
            category: article.category || categories[0]?.name || "",
            excerpt: article.excerpt || "",
            body: article.body || "",
            reading_time: article.reading_time || "5 daqiqa",
            published: article.published ?? true,
            image_url: article.image_url || "",
          });
        }
      }).catch(console.error);
    } else {
      setExisting(null);
    }
  }, [id]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const filename = `${Math.random().toString(36).slice(2)}_${Date.now()}.${ext}`;
    
    const { data, error } = await supabase.storage
      .from("article-images")
      .upload(filename, file);

    if (error) {
      alert("Rasm yuklashda xatolik");
    } else if (data) {
      const { data: publicUrlData } = supabase.storage
        .from("article-images")
        .getPublicUrl(data.path);
      setForm((f) => ({ ...f, image_url: publicUrlData.publicUrl }));
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveArticle({ data: { ...form, id: existing?.id } });
      navigate({ to: "/admin/articles" });
    } catch (err: any) {
      alert(err.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold">
          {existing ? "Maqolani tahrirlash" : "Yangi maqola"}
        </h1>
        <Link
          to="/admin/articles"
          className="text-sm font-medium text-ink/60 hover:text-ink"
        >
          Bekor qilish
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl bg-white p-8 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink/70">
              Sarlavha
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                const slug = title
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)+/g, "");
                setForm((f) => ({ ...f, title, slug: f.slug || slug }));
              }}
              className="w-full rounded-lg border border-ink/10 bg-cream/30 px-4 py-2 outline-none focus:border-green"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink/70">
              URL (slug)
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className="w-full rounded-lg border border-ink/10 bg-cream/30 px-4 py-2 outline-none focus:border-green"
              required
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink/70">
              Kategoriya (Mavzu)
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full rounded-lg border border-ink/10 bg-cream/30 px-4 py-2 outline-none focus:border-green"
              required
            >
              <option value="">Tanlang...</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink/70">
              O'qish vaqti
            </label>
            <input
              type="text"
              value={form.reading_time}
              onChange={(e) => setForm((f) => ({ ...f, reading_time: e.target.value }))}
              className="w-full rounded-lg border border-ink/10 bg-cream/30 px-4 py-2 outline-none focus:border-green"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink/70">
            Qisqa ta'rif (Excerpt)
          </label>
          <textarea
            value={form.excerpt}
            onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
            className="w-full rounded-lg border border-ink/10 bg-cream/30 px-4 py-2 outline-none focus:border-green"
            rows={2}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink/70">
            Asosiy matn
          </label>
          <textarea
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            className="w-full rounded-lg border border-ink/10 bg-cream/30 px-4 py-2 outline-none focus:border-green font-mono text-sm"
            rows={12}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink/70">
            Muqova rasmi
          </label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="text-sm"
            />
            {uploading && <span className="text-sm text-ink/50">Yuklanmoqda...</span>}
          </div>
          {form.image_url && (
            <img src={form.image_url} alt="Muqova" className="mt-4 h-32 rounded-lg object-cover" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            checked={form.published}
            onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
            className="rounded text-green focus:ring-green"
          />
          <label htmlFor="published" className="text-sm font-medium text-ink/70">
            Chop etish (saytda ko'rsatish)
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-green py-3 font-medium text-white hover:bg-green/90 disabled:opacity-50"
        >
          {loading ? "Saqlanmoqda..." : "Saqlash"}
        </button>
      </form>
    </div>
  );
}
