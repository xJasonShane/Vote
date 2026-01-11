// UserContext - 管理用户相关的全局状态

import React, { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import type { User } from '../types';
import { getCurrentUser, setCurrentUser, createUser, updateUser } from '../utils/managers/userManager';

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User) => void;
  createNewUser: (username: string) => User;
  updateUser: (userData: Partial<User>) => User | undefined;
  clearUser: () => void;
}

// 创建 Context
const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

// 创建 Provider 组件
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 初始化加载用户数据
  const loadUser = () => {
    try {
      setLoading(true);
      const currentUser = getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error('Error loading user:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 创建新用户
  const handleCreateUser = (username: string): User => {
    const newUser = createUser(username);
    setUser(newUser);
    return newUser;
  };

  // 更新用户信息
  const handleUpdateUser = (userData: Partial<User>): User | undefined => {
    if (!user) return undefined;
    
    const updatedUser = updateUser(user.id, userData);
    if (updatedUser) {
      setUser(updatedUser);
    }
    return updatedUser;
  };

  // 清除用户
  const handleClearUser = () => {
    setUser(null);
    setCurrentUser(null as any); // 清除存储中的当前用户
  };

  // 初始加载
  useEffect(() => {
    loadUser();
  }, []);

  const contextValue: UserContextType = {
    user,
    loading,
    setUser,
    createNewUser: handleCreateUser,
    updateUser: handleUpdateUser,
    clearUser: handleClearUser,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

// 自定义 Hook，方便使用 Context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
