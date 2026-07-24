import { Redis } from "ioredis";

// In-Memory L1 Cache item schema
interface CacheItem<T> {
  value: T;
  expiresAt: number;
}

// Global state preservation for Next.js (survives HMR and module re-evaluations)
const globalForCache = globalThis as unknown as {
  redis: Redis | null;
  memoryCache: Map<string, CacheItem<any>>;
  isRedisConnected: boolean;
  hasLoggedStatus: boolean;
};

if (!globalForCache.memoryCache) {
  globalForCache.memoryCache = new Map();
}

const MAX_MEMORY_CACHE_ITEMS = 1000;

// Helper: Prune L1 Memory Cache if over capacity or containing expired items
function cleanMemoryCache() {
  const now = Date.now();
  const cache = globalForCache.memoryCache;

  // 1. Delete expired keys
  for (const [key, item] of cache.entries()) {
    if (item.expiresAt <= now) {
      cache.delete(key);
    }
  }

  // 2. Evict oldest keys if still exceeding capacity
  if (cache.size > MAX_MEMORY_CACHE_ITEMS) {
    const keysToDelete = Array.from(cache.keys()).slice(0, cache.size - MAX_MEMORY_CACHE_ITEMS);
    for (const key of keysToDelete) {
      cache.delete(key);
    }
  }
}

// Helper: L1 Memory Cache Operations
function getFromMemory<T>(key: string): T | null {
  const item = globalForCache.memoryCache.get(key);
  if (!item) return null;
  if (item.expiresAt <= Date.now()) {
    globalForCache.memoryCache.delete(key);
    return null;
  }
  return item.value as T;
}

function setToMemory<T>(key: string, value: T, ttlSeconds: number) {
  cleanMemoryCache();
  globalForCache.memoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

function removeFromMemory(key: string | string[]) {
  const keys = Array.isArray(key) ? key : [key];
  for (const k of keys) {
    globalForCache.memoryCache.delete(k);
  }
}

function removePatternFromMemory(pattern: string) {
  const regexPattern = new RegExp("^" + pattern.replace(/\*/g, ".*") + "$");
  for (const key of globalForCache.memoryCache.keys()) {
    if (regexPattern.test(key)) {
      globalForCache.memoryCache.delete(key);
    }
  }
}

// Initialize Redis Client
function createRedisClient(): Redis {
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
  const client = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false, // Fail fast when disconnected, don't accumulate commands in memory
    connectTimeout: 2000,
    retryStrategy(times) {
      if (times > 5) return null; // Pause reconnecting after 5 attempts; operate in memory-only mode
      return Math.min(times * 200, 2000);
    },
  });

  client.on("connect", () => {
    globalForCache.isRedisConnected = true;
    if (!globalForCache.hasLoggedStatus) {
      console.log(`[Redis] Connected successfully to ${redisUrl}`);
      globalForCache.hasLoggedStatus = true;
    }
  });

  client.on("ready", () => {
    globalForCache.isRedisConnected = true;
  });

  client.on("error", (err) => {
    const wasConnected = globalForCache.isRedisConnected;
    globalForCache.isRedisConnected = false;
    if (wasConnected || !globalForCache.hasLoggedStatus) {
      console.warn(`[Redis] Connection unavailable (${err?.message || "Disconnected"}). Operating in memory-cache fallback mode.`);
      globalForCache.hasLoggedStatus = true;
    }
  });

  client.on("close", () => {
    globalForCache.isRedisConnected = false;
  });

  client.on("end", () => {
    globalForCache.isRedisConnected = false;
  });

  return client;
}

export const redis: Redis = globalForCache.redis || (globalForCache.redis = createRedisClient());

export interface CacheOptions {
  ttlSeconds?: number;
  skipMemory?: boolean;
}

/**
 * Fetch cached data with dual-layer (L1 Memory + L2 Redis) caching.
 * Falls back seamlessly to memory cache or fresh fetch if Redis is down.
 */
export async function getCachedData<T>(
  key: string,
  fetchData: () => Promise<T>,
  optionsOrTtl: number | CacheOptions = 60
): Promise<T> {
  const ttlSeconds = typeof optionsOrTtl === "number" ? optionsOrTtl : (optionsOrTtl.ttlSeconds ?? 60);
  const skipMemory = typeof optionsOrTtl === "object" ? (optionsOrTtl.skipMemory ?? false) : false;

  // Layer 1: Check In-Memory Cache (unless skipMemory is specified)
  if (!skipMemory) {
    const memoryHit = getFromMemory<T>(key);
    if (memoryHit !== null) {
      return memoryHit;
    }
  }

  // Layer 2: Check Redis Cache (if connected)
  if (globalForCache.isRedisConnected && redis) {
    try {
      const cached = await redis.get(key);
      if (cached) {
        const parsed = JSON.parse(cached) as T;
        if (!skipMemory) {
          setToMemory(key, parsed, ttlSeconds);
        }
        return parsed;
      }
    } catch {
      // Redis get failed; fallback quietly to fetchData
    }
  }

  // Layer 3: Fetch fresh data
  const freshData = await fetchData();

  // Store in L1 Memory Cache (unless skipMemory is specified)
  if (!skipMemory) {
    setToMemory(key, freshData, ttlSeconds);
  }

  // Store in L2 Redis Cache (if connected)
  if (globalForCache.isRedisConnected && redis) {
    try {
      await redis.set(key, JSON.stringify(freshData), "EX", ttlSeconds);
    } catch {
      // Redis set failed; silent fallback
    }
  }

  return freshData;
}

/**
 * Manually set data in both L1 Memory and L2 Redis cache.
 */
export async function setCachedData<T>(key: string, data: T, ttlSeconds: number = 60): Promise<void> {
  setToMemory(key, data, ttlSeconds);

  if (globalForCache.isRedisConnected && redis) {
    try {
      await redis.set(key, JSON.stringify(data), "EX", ttlSeconds);
    } catch {
      // Redis set failed; silent fallback
    }
  }
}

/**
 * Invalidate cache key(s) in both L1 Memory and L2 Redis.
 */
export async function invalidateCache(key: string | string[]): Promise<void> {
  removeFromMemory(key);

  if (globalForCache.isRedisConnected && redis) {
    try {
      const keys = Array.isArray(key) ? key : [key];
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch {
      // Redis del failed; silent fallback
    }
  }
}

/**
 * Invalidate cache matching a pattern (e.g., 'guild:123:*') in both L1 Memory and L2 Redis.
 */
export async function invalidateCachePattern(pattern: string): Promise<void> {
  removePatternFromMemory(pattern);

  if (globalForCache.isRedisConnected && redis) {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch {
      // Redis pattern del failed; silent fallback
    }
  }
}

