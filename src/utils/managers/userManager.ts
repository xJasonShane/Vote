// 用户管理器 - 处理用户数据的存储和检索

import { getStorageData, setStorageData, STORAGE_KEYS } from './storageManager';
import type { User } from '../../types';

// 更新存储键，添加用户相关的键
export const USER_STORAGE_KEYS = {
  CURRENT_USER: 'vote_rating_current_user',
  USERS: 'vote_rating_users',
} as const;

// 生成随机用户ID
const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// 获取当前用户
export const getCurrentUser = (): User | null => {
  return getStorageData<User>(USER_STORAGE_KEYS.CURRENT_USER);
};

// 设置当前用户
export const setCurrentUser = (user: User): boolean => {
  return setStorageData(USER_STORAGE_KEYS.CURRENT_USER, user);
};

// 创建新用户
export const createUser = (username: string): User => {
  const user: User = {
    id: generateUserId(),
    username,
    createdAt: new Date(),
    updatedAt: new Date(),
    favorites: [],
  };
  
  // 获取现有用户列表
  const existingUsers = getUsers();
  // 添加新用户
  existingUsers.push(user);
  // 保存到存储
  setStorageData(USER_STORAGE_KEYS.USERS, existingUsers);
  // 设置为当前用户
  setCurrentUser(user);
  
  return user;
};

// 获取所有用户
export const getUsers = (): User[] => {
  const users = getStorageData<User[]>(USER_STORAGE_KEYS.USERS);
  return users || [];
};

// 根据ID获取用户
export const getUserById = (userId: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.id === userId);
};

// 更新用户信息
export const updateUser = (userId: string, userData: Partial<User>): User | undefined => {
  const users = getUsers();
  const index = users.findIndex(user => user.id === userId);
  
  if (index !== -1) {
    const updatedUser = {
      ...users[index],
      ...userData,
      updatedAt: new Date(),
    };
    
    users[index] = updatedUser;
    setStorageData(USER_STORAGE_KEYS.USERS, users);
    
    // 如果更新的是当前用户，也更新当前用户
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(updatedUser);
    }
    
    return updatedUser;
  }
  
  return undefined;
};

// 清除当前用户
export const clearCurrentUser = (): boolean => {
  // 这里我们只是清除当前用户，而不是删除用户数据
  return setStorageData(USER_STORAGE_KEYS.CURRENT_USER, null);
};

// 添加收藏话题
export const addFavorite = (userId: string, topicId: string): User | undefined => {
  const users = getUsers();
  const index = users.findIndex(user => user.id === userId);
  
  if (index !== -1) {
    // 确保favorites数组存在
    if (!users[index].favorites) {
      users[index].favorites = [];
    }
    
    // 如果话题未被收藏，添加到收藏列表
    if (!users[index].favorites.includes(topicId)) {
      users[index].favorites.push(topicId);
      users[index].updatedAt = new Date();
      
      setStorageData(USER_STORAGE_KEYS.USERS, users);
      
      // 如果是当前用户，也更新当前用户
      const currentUser = getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        setCurrentUser(users[index]);
      }
      
      return users[index];
    }
  }
  
  return undefined;
};

// 取消收藏话题
export const removeFavorite = (userId: string, topicId: string): User | undefined => {
  const users = getUsers();
  const index = users.findIndex(user => user.id === userId);
  
  if (index !== -1) {
    // 确保favorites数组存在
    if (!users[index].favorites) {
      users[index].favorites = [];
    }
    
    // 如果话题已被收藏，从收藏列表中移除
    const topicIndex = users[index].favorites.indexOf(topicId);
    if (topicIndex !== -1) {
      users[index].favorites.splice(topicIndex, 1);
      users[index].updatedAt = new Date();
      
      setStorageData(USER_STORAGE_KEYS.USERS, users);
      
      // 如果是当前用户，也更新当前用户
      const currentUser = getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        setCurrentUser(users[index]);
      }
      
      return users[index];
    }
  }
  
  return undefined;
};

// 检查话题是否被收藏
export const isTopicFavorited = (userId: string, topicId: string): boolean => {
  const user = getUserById(userId);
  return user?.favorites?.includes(topicId) || false;
};

// 获取用户收藏的话题ID列表
export const getUserFavorites = (userId: string): string[] => {
  const user = getUserById(userId);
  return user?.favorites || [];
};
