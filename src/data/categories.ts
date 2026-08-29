export type Category = {
  slug: string;
  name: string;
  desc: string;
};

export const categories: Category[] = [
  { slug: "psixologiya", name: "Psixologiya", desc: "Inson xulqi va fikrlash mexanizmlari" },
  { slug: "farovonlik", name: "Farovonlik", desc: "Mental va jismoniy sog‘liq" },
  { slug: "talim", name: "Ta’lim", desc: "Samarali o‘rganish usullari" },
  { slug: "uyqu-stress", name: "Uyqu va stress", desc: "Dam olish, stress va motivatsiya" },
  { slug: "xarakter", name: "Xarakter va odatlar", desc: "Odatlar qanday shakllanadi" },
  { slug: "rivojlanish", name: "Shaxsiy rivojlanish", desc: "O‘sish va o‘zlikni anglash" },
  { slug: "qarorlar", name: "Qarorlar", desc: "Tanlov va hayotiy yo‘nalish" },
];

export const categoryName = (slug: string) =>
  categories.find((c) => c.slug === slug)?.name ?? slug;

export type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  image_url: string | null;
  reading_time: string;
  published: boolean;
  created_at: string;
};

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" });

export const bodyParagraphs = (body: string) =>
  body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

export const fallbackImage = "/article-eq.jpg";
