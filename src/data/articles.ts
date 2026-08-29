import sleepImg from "@/assets/article-sleep.jpg";
import habitsImg from "@/assets/article-habits.jpg";
import eqImg from "@/assets/article-eq.jpg";

export type Article = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readingTime: string;
  image: string;
  body: string[];
};

export const categories = [
  { slug: "psixologiya", name: "Psixologiya", desc: "Inson xulqi va fikrlash mexanizmlari" },
  { slug: "farovonlik", name: "Farovonlik", desc: "Mental va jismoniy sog‘liq" },
  { slug: "talim", name: "Ta’lim", desc: "Samarali o‘rganish usullari" },
  { slug: "uyqu-stress", name: "Uyqu va stress", desc: "Dam olish, stress va motivatsiya" },
  { slug: "xarakter", name: "Xarakter va odatlar", desc: "Odatlar qanday shakllanadi" },
  { slug: "rivojlanish", name: "Shaxsiy rivojlanish", desc: "O‘sish va o‘zlikni anglash" },
  { slug: "qarorlar", name: "Qarorlar", desc: "Tanlov va hayotiy yo‘nalish" },
];

export const articles: Article[] = [
  {
    slug: "sakkiz-soatlik-uyqu",
    title: "Nima uchun 8 soatlik uyqu ham yetarli bo‘lmasligi mumkin?",
    category: "Uyqu va stress",
    excerpt:
      "Sifatli dam olishning biologik va psixologik jihatlari haqida yangi tadqiqotlar tahlili.",
    date: "12-sentabr, 2026",
    readingTime: "6 daqiqa",
    image: sleepImg,
    body: [
      "Uyqu davomiyligi — bu faqat raqam. Tadqiqotlar shuni ko‘rsatadiki, uyqu sifati, ya’ni chuqur va REM bosqichlarining nisbati, ertangi kunimizdagi diqqat va hissiy barqarorlikni davomiylikdan ko‘ra kuchliroq belgilaydi.",
      "Kechki yorug‘lik, kofein va tartibsiz uyqu vaqti sirkad ritmni siljitadi. Natijada siz to‘shakda sakkiz soat yotasiz, ammo miya o‘zining tiklanish sikllarini to‘liq yakunlay olmaydi.",
      "Amaliy xulosa oddiy: har kuni bir xil vaqtda uyg‘oning, ertalabki tabiiy yorug‘likni oling va kechqurun ekran yorqinligini pasaytiring. Bu uch odat uyqu sifatini davomiylikni oshirishdan ko‘ra tezroq yaxshilaydi.",
      "Uyqu — dam olish emas, balki xotira, hissiyot va qaror qabul qilish tizimlarining tungi ta’mirlash ishi.",
    ],
  },
  {
    slug: "neyroplastiklik-va-odatlar",
    title: "Neyroplastiklik: qanday qilib eski odatlardan voz kechish mumkin?",
    category: "Xarakter va odatlar",
    excerpt: "Miya tuzilmasini o‘zgartirish orqali shaxsiy rivojlanishga erishish yo‘llari.",
    date: "5-sentabr, 2026",
    readingTime: "8 daqiqa",
    image: habitsImg,
    body: [
      "Odat — bu miyaning energiya tejash strategiyasi. Takrorlangan xatti-harakat bazal ganglionlarda avtomatlashadi va ongli e’tiborni talab qilmay qo‘yadi.",
      "Shu sababli odatni «kuch bilan» yo‘q qilish samarasiz. Uni almashtirish ancha ishonchli: bir xil ishorani (signalni) saqlab, unga yangi harakatni ulash kerak.",
      "Neyroplastiklik — miyaning bog‘lanishlarni qayta qurish qobiliyati — yoshdan qat’i nazar saqlanadi. Ammo u takrorlash va uyqu talab qiladi: yangi zanjirlar aynan dam olish paytida mustahkamlanadi.",
      "Kichik, aniq va kundalik takrorlanadigan harakat — katta, ammo tartibsiz urinishlardan doim ustun keladi.",
    ],
  },
  {
    slug: "hissiy-intellekt",
    title: "Hissiy intellekt va uning martaba o‘sishidagi o‘rni",
    category: "Psixologiya",
    excerpt: "Nima uchun EQ ko‘pincha IQ dan ko‘ra muhimroq hisoblanadi?",
    date: "28-avgust, 2026",
    readingTime: "7 daqiqa",
    image: eqImg,
    body: [
      "Hissiy intellekt — o‘z va o‘zgalar hissiyotlarini tanib olish, nomlash va boshqarish qobiliyati. U tug‘ma iste’dod emas, o‘rganiladigan ko‘nikma.",
      "Jamoada ishlash, nizolarni hal qilish va rahbarlik — bularning barchasi texnik bilimdan ko‘ra hissiy o‘qish qobiliyatiga tayanadi.",
      "EQ ni rivojlantirishning eng oddiy mashqi — kun oxirida uchta his-tuyg‘uni aniq so‘z bilan yozib qo‘yish. Nomlangan hissiyot kuchini yo‘qotadi va boshqariladigan bo‘lib qoladi.",
    ],
  },
  {
    slug: "chuqur-diqqat",
    title: "Diqqatni jamlash san’ati: chuqur ish holatiga kirish",
    category: "Ta’lim",
    excerpt: "Chalg‘ituvchi dunyoda e’tibor eng qimmatli resursga aylandi.",
    date: "20-avgust, 2026",
    readingTime: "9 daqiqa",
    image: sleepImg,
    body: [
      "Diqqat — cheklangan resurs. Har bir uzilishdan keyin miyaga avvalgi kontekstga qaytish uchun o‘rtacha 15-20 daqiqa kerak bo‘ladi.",
      "Chuqur ish uchun uchta shart yetarli: aniq boshlanish vaqti, bitta vazifa va tashqi signallarning yo‘qligi.",
      "Kuniga 90 daqiqalik ikkita chuqur blok — sakkiz soatlik uzilib-uzilib ishlashdan ko‘ra ko‘proq natija beradi.",
    ],
  },
  {
    slug: "qaror-qabul-qilish",
    title: "Nima uchun biz o‘zimizga zararli qarorlar qabul qilamiz?",
    category: "Qarorlar",
    excerpt: "Kognitiv xatoliklar va ularning hayot sifatiga uzoq muddatli ta’siri.",
    date: "11-avgust, 2026",
    readingTime: "10 daqiqa",
    image: eqImg,
    body: [
      "Qaror qabul qilish paytida miya ikki tizim o‘rtasida ishlaydi: tez, avtomatik va sekin, tahliliy. Charchoq va stress birinchisining ta’sirini kuchaytiradi.",
      "Eng keng tarqalgan xatoliklar — hozirgi lazzatni ustun qo‘yish, tasdiqlash tarafkashligi va yo‘qotishdan qo‘rquv.",
      "Yechim: muhim qarorlarni ertalabki soatlarga ko‘chiring, mezonlarni oldindan yozing va qaror sabablarini qayd etib boring.",
    ],
  },
  {
    slug: "shaxsiy-rivojlanish-maqsad",
    title: "Maqsad qo‘yishning beshta ilmiy usuli",
    category: "Shaxsiy rivojlanish",
    excerpt: "Dopaminning roli va motivatsiyani uzoq muddat saqlash bo‘yicha amaliy tavsiyalar.",
    date: "2-avgust, 2026",
    readingTime: "5 daqiqa",
    image: habitsImg,
    body: [
      "Motivatsiya natijadan emas, jarayondagi kichik yutuqlardan oziqlanadi. Dopamin ko‘proq kutish bosqichida ajraladi.",
      "Shuning uchun katta maqsadni o‘lchanadigan haftalik qadamlarga bo‘lish shart. Har bir qadam — kichik mukofot signali.",
      "Maqsadni yozib qo‘ying, uni kimgadir ayting va haftalik qayta ko‘rib chiqish odatini yarating.",
    ],
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
