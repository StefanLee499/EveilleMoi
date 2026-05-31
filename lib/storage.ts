import fs from "node:fs/promises";
import path from "node:path";

const DATA_DIR = process.env.VERCEL ? "/tmp/.data" : path.join(process.cwd(), ".data");

async function ensure() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function append<T>(file: string, entry: T): Promise<T & { id: string; createdAt: string }> {
  await ensure();
  const fp = path.join(DATA_DIR, file);
  let arr: any[] = [];
  try {
    const raw = await fs.readFile(fp, "utf8");
    arr = JSON.parse(raw);
  } catch {
    arr = [];
  }
  const record = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    ...entry,
  };
  arr.push(record);
  await fs.writeFile(fp, JSON.stringify(arr, null, 2), "utf8");
  return record as T & { id: string; createdAt: string };
}

export async function readAll<T = any>(file: string): Promise<T[]> {
  await ensure();
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
