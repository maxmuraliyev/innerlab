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
  { slug: "psychology", name: "Psychology", desc: "Human behavior and thinking mechanisms" },
  { slug: "well-being", name: "Well-being", desc: "Mental and physical health" },
  { slug: "education", name: "Education", desc: "Effective learning methods" },
  { slug: "sleep-stress", name: "Sleep and stress", desc: "Rest, stress and motivation" },
  { slug: "character", name: "Character and habits", desc: "How habits are formed" },
  { slug: "development", name: "Personal development", desc: "Growth and self-awareness" },
  { slug: "decisions", name: "Decisions", desc: "Choices and life direction" },
];

export const articles: Article[] = [
  {
    slug: "eight-hour-sleep",
    title: "Why 8 hours of sleep might not be enough?",
    category: "Sleep and stress",
    excerpt:
      "An analysis of new research on the biological and psychological aspects of quality rest.",
    date: "September 12, 2026",
    readingTime: "6 minutes",
    image: sleepImg,
    body: [
      "Sleep duration is just a number. Studies show that sleep quality, namely the ratio of deep and REM stages, determines our focus and emotional stability the next day much more strongly than duration.",
      "Evening light, caffeine, and irregular bedtimes shift the circadian rhythm. As a result, you lie in bed for eight hours, but the brain cannot fully complete its recovery cycles.",
      "The practical conclusion is simple: wake up at the same time every day, get natural light in the morning, and reduce screen brightness in the evening. These three habits improve sleep quality faster than increasing its duration.",
      "Sleep is not rest, but the night shift of repairing memory, emotion, and decision-making systems.",
    ],
  },
  {
    slug: "neuroplasticity-and-habits",
    title: "Neuroplasticity: how to break old habits?",
    category: "Character and habits",
    excerpt: "Ways to achieve personal development by rewiring the brain structure.",
    date: "September 5, 2026",
    readingTime: "8 minutes",
    image: habitsImg,
    body: [
      "A habit is the brain's energy-saving strategy. Repeated behavior becomes automated in the basal ganglia and stops requiring conscious attention.",
      "Therefore, destroying a habit by force is ineffective. Replacing it is much more reliable: you need to keep the same cue (signal) and attach a new action to it.",
      "Neuroplasticity — the brain's ability to restructure connections — is preserved regardless of age. But it requires repetition and sleep: new circuits are strengthened exactly during rest.",
      "A small, clear, and daily repeated action always beats large, but irregular efforts.",
    ],
  },
  {
    slug: "emotional-intelligence",
    title: "Emotional intelligence and its role in career growth",
    category: "Psychology",
    excerpt: "Why is EQ often considered more important than IQ?",
    date: "August 28, 2026",
    readingTime: "7 minutes",
    image: eqImg,
    body: [
      "Emotional intelligence is the ability to recognize, name, and manage one's own and others' emotions. It is not an innate talent, but a learned skill.",
      "Teamwork, conflict resolution, and leadership — all these rely more on emotional reading ability than on technical knowledge.",
      "The simplest exercise to develop EQ is to write down three emotions at the end of the day with exact words. A named emotion loses its power and becomes manageable.",
    ],
  },
  {
    slug: "deep-focus",
    title: "The art of concentration: entering a state of deep work",
    category: "Education",
    excerpt: "In a distracting world, attention has become the most valuable resource.",
    date: "August 20, 2026",
    readingTime: "9 minutes",
    image: sleepImg,
    body: [
      "Attention is a limited resource. After every interruption, the brain needs an average of 15-20 minutes to return to the previous context.",
      "Three conditions are enough for deep work: a clear start time, a single task, and the absence of external signals.",
      "Two 90-minute blocks of deep work a day yield more results than eight hours of fragmented work.",
    ],
  },
  {
    slug: "decision-making",
    title: "Why do we make harmful decisions for ourselves?",
    category: "Decisions",
    excerpt: "Cognitive biases and their long-term impact on quality of life.",
    date: "August 11, 2026",
    readingTime: "10 minutes",
    image: eqImg,
    body: [
      "During decision-making, the brain operates between two systems: fast/automatic and slow/analytical. Fatigue and stress amplify the influence of the first.",
      "The most common biases are prioritizing immediate pleasure, confirmation bias, and fear of loss.",
      "The solution: move important decisions to the morning hours, write down criteria in advance, and record the reasons for decisions.",
    ],
  },
  {
    slug: "personal-development-goals",
    title: "Five scientific methods of goal setting",
    category: "Personal development",
    excerpt: "The role of dopamine and practical recommendations for maintaining long-term motivation.",
    date: "August 2, 2026",
    readingTime: "5 minutes",
    image: habitsImg,
    body: [
      "Motivation is fed not by the result, but by small achievements in the process. Dopamine is released more during the anticipation phase.",
      "Therefore, a big goal must be broken down into measurable weekly steps. Each step is a small reward signal.",
      "Write down the goal, tell someone about it, and create a habit of weekly review.",
    ],
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
