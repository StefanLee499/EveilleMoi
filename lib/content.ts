export type Service = {
  id: string;
  category: "Massage" | "Astrology";
  name: string;
  duration: string;
  price: number;
  blurb: string;
  description?: string;
  details: string[];
  published?: boolean;
};

export const services: Service[] = [
  {
    id: "massage-signature",
    category: "Massage",
    name: "Signature Awakening Massage",
    duration: "75 min",
    price: 95,
    blurb: "A slow, deeply grounding full-body ritual with warm oil and breath work.",
    details: [
      "Aromatherapy consultation",
      "Long, flowing strokes (Swedish + Lomi-Lomi inspired)",
      "Scalp and feet finish",
    ],
  },
  {
    id: "massage-deep",
    category: "Massage",
    name: "Deep Tissue Release",
    duration: "60 min",
    price: 80,
    blurb: "Targeted work for held tension in shoulders, back and hips.",
    details: ["Trigger-point therapy", "Heated stone option", "Stretch integration"],
  },
  {
    id: "massage-prenatal",
    category: "Massage",
    name: "Prenatal Cocoon",
    duration: "60 min",
    price: 85,
    blurb: "A safe, side-lying massage for every trimester after the first.",
    details: ["Pregnancy-safe oils", "Bolster support", "Light reflexology"],
  },
  {
    id: "astro-natal",
    category: "Astrology",
    name: "Natal Chart Reading",
    duration: "90 min",
    price: 120,
    blurb: "Your full astrological blueprint — read with warmth, not jargon.",
    details: ["Pre-session questionnaire", "Live chart walk-through", "Recording + PDF"],
  },
  {
    id: "astro-yearahead",
    category: "Astrology",
    name: "Year Ahead Forecast",
    duration: "60 min",
    price: 90,
    blurb: "Transits, themes and tender moments for the next 12 months.",
    details: ["Personal timeline", "Key dates to honour", "Ritual suggestions"],
  },
  {
    id: "astro-synastry",
    category: "Astrology",
    name: "Relationship Synastry",
    duration: "75 min",
    price: 110,
    blurb: "Understand the dance between two charts — romantic, family or work.",
    details: ["Composite + synastry", "Recording included", "Follow-up notes"],
  },
];

export type Product = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  cadence: "Monthly" | "Quarterly" | "One-time";
  contents: string[];
  badge?: string;
  published?: boolean;
};

export const products: Product[] = [
  {
    id: "box-monthly",
    name: "The Monthly EveilleMoi Box",
    tagline: "A curated wellness ritual delivered to your door.",
    description:
      "Each box follows a theme — moon phase, season or intention — and arrives with seven small, carefully chosen objects to support your practice.",
    price: 49,
    cadence: "Monthly",
    contents: [
      "Hand-blended essential oil",
      "Loose-leaf herbal tea",
      "Ritual candle",
      "Crystal of the moon",
      "Printed astro-forecast",
      "Guided audio meditation",
      "A small surprise",
    ],
    badge: "Most loved",
  },
  {
    id: "box-quarterly",
    name: "Seasonal Box",
    tagline: "Four times a year, deeper and more generous.",
    description:
      "A larger ritual box aligned with the equinoxes and solstices. Includes a ceremonial item and a longer printed guide.",
    price: 119,
    cadence: "Quarterly",
    contents: [
      "Ceremonial bundle",
      "Seasonal oil + tea pairing",
      "Ritual candle (large)",
      "Two crystals",
      "32-page printed guide",
      "Guided audio (45 min)",
      "Hand-written note",
    ],
  },
  {
    id: "gift-card",
    name: "Discovery Gift",
    tagline: "A single box, beautifully wrapped.",
    description:
      "Try the ritual once, or gift it. Arrives in cream paper with a hand-tied linen ribbon and a small printed card.",
    price: 55,
    cadence: "One-time",
    contents: [
      "One monthly box",
      "Linen gift wrap",
      "Hand-written card",
      "Ships within 3 days",
    ],
  },
];

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Wellness" | "Astrology" | "Lifestyle" | "Reflections";
  date: string;
  read: string;
  body: string[];
  published?: boolean;
};

export const articles: Article[] = [
  {
    slug: "morning-ritual-for-soft-mornings",
    title: "A Morning Ritual for Soft, Slow Mornings",
    excerpt:
      "Five minutes, three breaths and one warm cup — a tiny practice to begin your day from inside out.",
    category: "Wellness",
    date: "2026-05-12",
    read: "4 min",
    body: [
      "There is a small, almost invisible window between waking and reaching for the phone. That window is sacred.",
      "Begin by sitting up slowly. Place one hand on your chest, one on your belly. Three long breaths — that is all.",
      "Then water, warm. A tea you love. And only after — the world. This is not productivity advice. It is permission.",
    ],
  },
  {
    slug: "new-moon-in-gemini",
    title: "New Moon in Gemini: What to Plant",
    excerpt:
      "Curious, talkative, gently scattered — Gemini's new moon invites us to write down the questions we have been avoiding.",
    category: "Astrology",
    date: "2026-05-05",
    read: "6 min",
    body: [
      "Gemini collects. Ideas, conversations, postcards, half-finished books. This new moon is not for choosing — it is for noticing.",
      "Write three pages. No editing. Then close the notebook and let it rest for a week.",
      "When you return, underline only what still feels alive. That is the seed.",
    ],
  },
  {
    slug: "what-is-in-the-may-box",
    title: "Inside the May Box: Rose, Quartz and Quiet",
    excerpt: "A look at this month's theme — softness as a form of strength.",
    category: "Lifestyle",
    date: "2026-04-28",
    read: "3 min",
    body: [
      "This month we leaned into rose — the oil, the tea, the colour of the candle.",
      "Rose quartz sits in the centre of the box because softness is, in fact, a kind of courage.",
      "The audio meditation is 12 minutes long. Listen with your eyes closed.",
    ],
  },
  {
    slug: "on-being-tired",
    title: "On Being Tired (and Honouring It)",
    excerpt: "A short reflection on rest as the most radical kind of self-care.",
    category: "Reflections",
    date: "2026-04-14",
    read: "5 min",
    body: [
      "We are not machines, although the world often forgets.",
      "When you are tired, the answer is rarely more discipline. It is more sleep, more water, more saying no.",
      "Today, choose one thing to release. That is enough.",
    ],
  },
];
