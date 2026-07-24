import { Redis } from "ioredis";

// Use global to prevent multiple instances in development due to HMR
const globalForRedis = global as unknown as { redis: Redis };

export const redis =
  globalForRedis.redis ||
  new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      if (times > 3) return null;
      return Math.min(times * 50, 1000);
    },
  });

redis.on("error", (err) => {
  // Suppress unhandled connection errors when Redis is down
});

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

export async function getCachedData<T>(
  key: string,
  fetchData: () => Promise<T>,
  ttlSeconds: number = 60
): Promise<T> {
  try {
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.warn(`Redis get failed for key ${key}, falling back to fetch.`);
  }

  const data = await fetchData();
  
  try {
    await redis.set(key, JSON.stringify(data), "EX", ttlSeconds);
  } catch (error) {
    console.warn(`Redis set failed for key ${key}.`);
  }
  return data;
}

export async function setCachedData(key: string, data: any, ttlSeconds: number = 60) {
  try {
    await redis.set(key, JSON.stringify(data), "EX", ttlSeconds);
  } catch (error) {
    console.warn(`Redis set failed for key ${key}.`);
  }
}

export async function invalidateCache(key: string) {
  try {
    await redis.del(key);
  } catch (error) {
    console.warn(`Redis del failed for key ${key}.`);
  }
}
