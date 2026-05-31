import fs from "node:fs/promises";
import path from "node:path";
import { hashPassword } from "./auth";
import {
  services as seedServices,
  products as seedProducts,
  articles as seedArticles,
  type Service,
  type Product,
  type Article,
} from "./content";

const DATA_DIR = process.env.VERCEL ? "/tmp/.data" : path.join(process.cwd(), ".data");

async function ensure() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJson<T>(file: string, seed: T): Promise<T> {
  await ensure();
  const fp = path.join(DATA_DIR, file);
  try {
    const raw = await fs.readFile(fp, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    await fs.writeFile(fp, JSON.stringify(seed, null, 2), "utf8");
    return seed;
  }
}

async function writeJson<T>(file: string, data: T): Promise<void> {
  await ensure();
  await fs.writeFile(path.join(DATA_DIR, file), JSON.stringify(data, null, 2), "utf8");
}

/* ---------- Users ---------- */

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: "customer" | "admin";
  createdAt: string;
  // settings
  phone?: string;
  birthDate?: string;
  preferences?: {
    newsletter?: boolean;
    moonReminders?: boolean;
  };
};

const ADMIN_DEFAULT_EMAIL = "admin@eveillemoi.local";
const ADMIN_DEFAULT_PASSWORD = "admin1234";

async function seedAdmin(): Promise<User[]> {
  const u: User = {
    id: "admin-seed",
    email: ADMIN_DEFAULT_EMAIL,
    passwordHash: hashPassword(ADMIN_DEFAULT_PASSWORD),
    name: "Elise (Admin)",
    role: "admin",
    createdAt: new Date().toISOString(),
    preferences: { newsletter: true, moonReminders: true },
  };
  return [u];
}

let _usersInit: Promise<User[]> | null = null;
async function getUsers(): Promise<User[]> {
  if (!_usersInit) {
    _usersInit = (async () => {
      const fp = path.join(DATA_DIR, "users.json");
      await ensure();
      try {
        const raw = await fs.readFile(fp, "utf8");
        return JSON.parse(raw) as User[];
      } catch {
        const seeded = await seedAdmin();
        await fs.writeFile(fp, JSON.stringify(seeded, null, 2), "utf8");
        return seeded;
      }
    })();
  }
  return _usersInit;
}

async function saveUsers(users: User[]) {
  _usersInit = Promise.resolve(users);
  await writeJson("users.json", users);
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const u = await getUsers();
  return u.find((x) => x.email.toLowerCase() === email.toLowerCase());
}

export async function findUserById(id: string): Promise<User | undefined> {
  const u = await getUsers();
  return u.find((x) => x.id === id);
}

export async function createUser(input: {
  email: string;
  password: string;
  name: string;
  role?: "customer" | "admin";
}): Promise<User> {
  const users = await getUsers();
  if (users.some((x) => x.email.toLowerCase() === input.email.toLowerCase())) {
    throw new Error("An account with this email already exists.");
  }
  const user: User = {
    id: `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    email: input.email.toLowerCase(),
    passwordHash: hashPassword(input.password),
    name: input.name,
    role: input.role ?? "customer",
    createdAt: new Date().toISOString(),
    preferences: { newsletter: false, moonReminders: true },
  };
  users.push(user);
  await saveUsers(users);
  return user;
}

export async function updateUser(id: string, patch: Partial<User>): Promise<User | undefined> {
  const users = await getUsers();
  const i = users.findIndex((x) => x.id === id);
  if (i < 0) return;
  const safePatch = { ...patch };
  delete (safePatch as any).id;
  delete (safePatch as any).role;
  delete (safePatch as any).passwordHash;
  delete (safePatch as any).createdAt;
  users[i] = { ...users[i], ...safePatch };
  await saveUsers(users);
  return users[i];
}

export async function updatePassword(id: string, newPassword: string): Promise<boolean> {
  const users = await getUsers();
  const i = users.findIndex((x) => x.id === id);
  if (i < 0) return false;
  users[i].passwordHash = hashPassword(newPassword);
  await saveUsers(users);
  return true;
}

export function publicUser(u: User) {
  const { passwordHash, ...rest } = u;
  return rest;
}

/* ---------- Services ---------- */

function normalizeService(s: Service): Service {
  return { ...s, published: s.published ?? true };
}

export async function getServices(): Promise<Service[]> {
  const list = await readJson<Service[]>("services.json", seedServices);
  return list.map(normalizeService);
}
export async function getPublishedServices(): Promise<Service[]> {
  return (await getServices()).filter((s) => s.published !== false);
}
export async function updateService(id: string, patch: Partial<Service>): Promise<Service | undefined> {
  const list = await getServices();
  const i = list.findIndex((s) => s.id === id);
  if (i < 0) return;
  list[i] = normalizeService({ ...list[i], ...patch, id: list[i].id });
  await writeJson("services.json", list);
  return list[i];
}
export async function createService(input: Omit<Service, "id"> & { id?: string }): Promise<Service> {
  const list = await getServices();
  const baseId = (input.id || input.name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
  let id = baseId || `service-${Date.now().toString(36)}`;
  let n = 1;
  while (list.some((s) => s.id === id)) id = `${baseId}-${++n}`;
  const service: Service = normalizeService({
    id,
    category: input.category,
    name: input.name,
    duration: input.duration,
    price: Number(input.price) || 0,
    blurb: input.blurb,
    description: input.description ?? "",
    details: Array.isArray(input.details) ? input.details : [],
    published: input.published ?? true,
  });
  list.push(service);
  await writeJson("services.json", list);
  return service;
}
export async function deleteService(id: string): Promise<boolean> {
  const list = await getServices();
  const next = list.filter((s) => s.id !== id);
  if (next.length === list.length) return false;
  await writeJson("services.json", next);
  return true;
}

/* ---------- Products ---------- */

function normalizeProduct(p: Product): Product {
  return { ...p, published: p.published ?? true };
}

export async function getProducts(): Promise<Product[]> {
  const list = await readJson<Product[]>("products.json", seedProducts);
  return list.map(normalizeProduct);
}
export async function getPublishedProducts(): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.published !== false);
}
export async function updateProduct(id: string, patch: Partial<Product>): Promise<Product | undefined> {
  const list = await getProducts();
  const i = list.findIndex((p) => p.id === id);
  if (i < 0) return;
  list[i] = normalizeProduct({ ...list[i], ...patch, id: list[i].id });
  await writeJson("products.json", list);
  return list[i];
}
export async function createProduct(input: Omit<Product, "id"> & { id?: string }): Promise<Product> {
  const list = await getProducts();
  const baseId = (input.id || input.name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
  let id = baseId || `product-${Date.now().toString(36)}`;
  let n = 1;
  while (list.some((p) => p.id === id)) id = `${baseId}-${++n}`;
  const product: Product = normalizeProduct({
    id,
    name: input.name,
    tagline: input.tagline,
    description: input.description,
    price: Number(input.price) || 0,
    cadence: input.cadence,
    contents: Array.isArray(input.contents) ? input.contents : [],
    badge: input.badge,
    published: input.published ?? true,
  });
  list.push(product);
  await writeJson("products.json", list);
  return product;
}
export async function deleteProduct(id: string): Promise<boolean> {
  const list = await getProducts();
  const next = list.filter((p) => p.id !== id);
  if (next.length === list.length) return false;
  await writeJson("products.json", next);
  return true;
}

/* ---------- Articles ---------- */

function normalizeArticle(a: Article): Article {
  return { ...a, published: a.published ?? true };
}

export async function getArticles(): Promise<Article[]> {
  const list = await readJson<Article[]>("articles.json", seedArticles);
  return list.map(normalizeArticle);
}
export async function getPublishedArticles(): Promise<Article[]> {
  return (await getArticles()).filter((a) => a.published !== false);
}
export async function getArticle(slug: string): Promise<Article | undefined> {
  const list = await getArticles();
  return list.find((a) => a.slug === slug);
}
export async function createArticle(input: Omit<Article, "slug"> & { slug?: string }): Promise<Article> {
  const list = await getArticles();
  const baseSlug = (input.slug || input.title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
  let slug = baseSlug || `article-${Date.now().toString(36)}`;
  let n = 1;
  while (list.some((a) => a.slug === slug)) slug = `${baseSlug}-${++n}`;
  const article: Article = normalizeArticle({
    slug,
    title: input.title,
    excerpt: input.excerpt,
    category: input.category,
    date: input.date || new Date().toISOString().slice(0, 10),
    read: input.read || `${Math.max(1, Math.round((input.body.join(" ").split(/\s+/).length || 1) / 200))} min`,
    body: input.body,
    published: input.published ?? true,
  });
  list.unshift(article);
  await writeJson("articles.json", list);
  return article;
}
export async function updateArticle(slug: string, patch: Partial<Article>): Promise<Article | undefined> {
  const list = await getArticles();
  const i = list.findIndex((a) => a.slug === slug);
  if (i < 0) return;
  list[i] = normalizeArticle({ ...list[i], ...patch, slug: list[i].slug });
  await writeJson("articles.json", list);
  return list[i];
}
export async function deleteArticle(slug: string): Promise<boolean> {
  const list = await getArticles();
  const next = list.filter((a) => a.slug !== slug);
  if (next.length === list.length) return false;
  await writeJson("articles.json", next);
  return true;
}

export const ADMIN_SEED_INFO = { email: ADMIN_DEFAULT_EMAIL, password: ADMIN_DEFAULT_PASSWORD };
