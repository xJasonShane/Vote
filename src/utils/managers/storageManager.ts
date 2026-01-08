// 存储管理器 - 提供统一的存储接口

// 数据存储键名
export const STORAGE_KEYS = {
  TOPICS: 'vote_rating_topics',
} as const;

// 检查 localStorage 是否可用
const isStorageAvailable = (): boolean => {
  try {
    return typeof localStorage !== 'undefined';
  } catch (error) {
    return false;
  }
};

// 获取存储数据
export const getStorageData = <T>(key: string): T | null => {
  if (!isStorageAvailable()) {
    return null;
  }
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting storage data:', error);
    return null;
  }
};

// 设置存储数据
export const setStorageData = <T>(key: string, data: T): boolean => {
  if (!isStorageAvailable()) {
    return false;
  }
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error setting storage data:', error);
    return false;
  }
};

// 清除存储数据
export const clearStorageData = (key: string): boolean => {
  if (!isStorageAvailable()) {
    return false;
  }
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error clearing storage data:', error);
    return false;
  }
};
