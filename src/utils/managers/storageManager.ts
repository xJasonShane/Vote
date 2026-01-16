// 存储管理器 - 提供统一的存储接口，包含内存缓存优化

// 数据存储键名
export const STORAGE_KEYS = {
  TOPICS: 'vote_rating_topics',
} as const;

// 内存缓存对象
const memoryCache: Record<string, any> = {};

// 缓存有效期（毫秒）
const CACHE_TTL = 5 * 60 * 1000; // 5分钟

// 缓存项类型
interface CacheItem {
  data: any;
  timestamp: number;
}

// 检查 localStorage 是否可用
const isStorageAvailable = (): boolean => {
  try {
    return typeof localStorage !== 'undefined';
  } catch {
    return false;
  }
};

// 检查缓存是否有效
const isCacheValid = (cacheItem: CacheItem | undefined): boolean => {
  if (!cacheItem) return false;
  return Date.now() - cacheItem.timestamp < CACHE_TTL;
};

// 获取存储数据，带内存缓存
/**
 * 获取存储数据，带内存缓存机制
 * @template T - 数据类型
 * @param {string} key - 存储键名
 * @param {boolean} [forceRefresh=false] - 是否强制刷新缓存
 * @returns {T | null} 存储的数据或null
 */
export const getStorageData = <T>(key: string, forceRefresh: boolean = false): T | null => {
  // 检查内存缓存
  const cacheItem = memoryCache[key];
  if (!forceRefresh && isCacheValid(cacheItem)) {
    return cacheItem.data as T;
  }

  if (!isStorageAvailable()) {
    return null;
  }

  try {
    const data = localStorage.getItem(key);
    const parsedData = data ? JSON.parse(data) : null;
    
    // 更新内存缓存
    memoryCache[key] = {
      data: parsedData,
      timestamp: Date.now(),
    };
    
    return parsedData as T;
  } catch (error) {
    console.error('Error getting storage data:', error);
    return null;
  }
};

// 设置存储数据，同时更新内存缓存
/**
 * 设置存储数据，同时更新内存缓存
 * @template T - 数据类型
 * @param {string} key - 存储键名
 * @param {T} data - 要存储的数据
 * @returns {boolean} 是否成功存储
 */
export const setStorageData = <T>(key: string, data: T): boolean => {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    localStorage.setItem(key, JSON.stringify(data));
    
    // 更新内存缓存
    memoryCache[key] = {
      data,
      timestamp: Date.now(),
    };
    
    return true;
  } catch (error) {
    console.error('Error setting storage data:', error);
    return false;
  }
};

// 清除存储数据，同时清除内存缓存
/**
 * 清除存储数据，同时清除内存缓存
 * @param {string} key - 存储键名
 * @returns {boolean} 是否成功清除
 */
export const clearStorageData = (key: string): boolean => {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    localStorage.removeItem(key);
    
    // 清除内存缓存
    delete memoryCache[key];
    
    return true;
  } catch (error) {
    console.error('Error clearing storage data:', error);
    return false;
  }
};

// 清除所有内存缓存
/**
 * 清除所有内存缓存，强制下次读取时从localStorage获取
 */
export const clearMemoryCache = (): void => {
  Object.keys(memoryCache).forEach(key => {
    delete memoryCache[key];
  });
};

// 批量获取存储数据
/**
 * 批量获取存储数据
 * @template T - 数据类型映射
 * @param {Array<keyof T>} keys - 要获取的键名数组
 * @returns {Partial<T>} 包含获取数据的对象
 */
export const getStorageDataBatch = <T extends Record<string, any>>(keys: Array<keyof T>): Partial<T> => {
  const result: Partial<T> = {};
  
  keys.forEach(key => {
    const data = getStorageData<T[keyof T]>(key as string);
    if (data !== null) {
      result[key] = data as T[keyof T];
    }
  });
  
  return result;
};

// 批量设置存储数据
/**
 * 批量设置存储数据
 * @template T - 数据类型
 * @param {Array<{ key: string; data: T }>} items - 要设置的数据项数组
 * @returns {boolean} 是否所有操作都成功
 */
export const setStorageDataBatch = <T>(items: Array<{ key: string; data: T }>): boolean => {
  let allSuccess = true;
  
  items.forEach(item => {
    const success = setStorageData(item.key, item.data);
    if (!success) {
      allSuccess = false;
    }
  });
  
  return allSuccess;
};
