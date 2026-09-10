import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'store.json');
const STORE_KEY = 'dealloop_store';
const DEFAULT_STORE = {
  categories: [],
  products: [],
  pages: [],
  blogs: [],
  coupons: [],
  videos: [],
  banners: [],
  brands: [],
  settings: { logoImage: '', siteTitle: '', siteDescription: '', showBanners: true }
};

// Vercel ab "Upstash" ko Marketplace se integrate karwata hai (purana native "KV"
// product hata diya gaya hai), lekin dono hi env var naming use karte hain — is liye
// hum dono check kar lete hain: KV_REST_API_URL/TOKEN (zyada common) ya
// UPSTASH_REDIS_REST_URL/TOKEN (agar Upstash console se directly connect kiya ho).
const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const useRedis = !!(REDIS_URL && REDIS_TOKEN);

let redisClient;
async function getRedis() {
  if (!redisClient) {
    const { Redis } = await import('@upstash/redis');
    redisClient = new Redis({ url: REDIS_URL, token: REDIS_TOKEN });
  }
  return redisClient;
}

async function readDB() {
  if (useRedis) {
    const redis = await getRedis();
    const data = await redis.get(STORE_KEY);
    return {
      categories: data?.categories || [],
      products: data?.products || [],
      pages: data?.pages || [],
      blogs: data?.blogs || [],
      coupons: data?.coupons || [],
      videos: data?.videos || [],
      banners: data?.banners || [],
      brands: data?.brands || [],
      settings: {
        logoImage: data?.settings?.logoImage || '',
        siteTitle: data?.settings?.siteTitle || '',
        siteDescription: data?.settings?.siteDescription || '',
        showBanners: data?.settings?.showBanners !== false
      }
    };
  }

  // Local dev mein (bina Redis connect kiye) purani JSON-file storage hi chalti hai
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  const data = JSON.parse(raw);
  return {
    ...DEFAULT_STORE,
    ...data,
    settings: { ...DEFAULT_STORE.settings, ...data.settings }
  };
}

async function writeDB(data) {
  if (useRedis) {
    const redis = await getRedis();
    await redis.set(STORE_KEY, data);
    return;
  }

  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// regular price ke against sale price ka discount % nikalta hai
function calcDiscount(regularPrice, salePrice) {
  const reg = Number(regularPrice);
  const sale = Number(salePrice);
  if (!reg || reg <= 0 || sale == null) return 0;
  const pct = ((reg - sale) / reg) * 100;
  return Math.max(0, Math.round(pct * 100) / 100);
}

export { readDB, writeDB, genId, slugify, calcDiscount };
