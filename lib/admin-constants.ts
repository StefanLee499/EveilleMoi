export const ARTICLE_CATEGORIES = ["Wellness", "Astrology", "Lifestyle", "Reflections"] as const;
export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

export const SERVICE_CATEGORIES = ["Massage", "Astrology"] as const;
export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

export const PRODUCT_CADENCES = ["Monthly", "Quarterly", "One-time"] as const;
export type ProductCadence = (typeof PRODUCT_CADENCES)[number];
