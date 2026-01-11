// UserAuth - 用户认证组件，用于登录和注册

import React, { useState } from 'react';

// 定义 User 接口的本地版本，避免依赖外部类型
interface LocalUser {
  id: string;
  username: string;
  email?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserAuthProps {
  onClose?: () => void;
}

// 创建一个简单的用户状态管理器，用于在组件内部管理用户状态
const useLocalUser = () => {
  // 在客户端使用 localStorage 存储用户信息
  const [user, setUser] = useState<LocalUser | null>(() => {
    if (typeof window === 'undefined') return null;
    
    const savedUser = localStorage.getItem('vote_rating_current_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const createNewUser = (username: string) => {
    if (typeof window === 'undefined') return null;
    
    const newUser: LocalUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // 获取现有用户列表
    const existingUsers = JSON.parse(localStorage.getItem('vote_rating_users') || '[]');
    existingUsers.push(newUser);
    localStorage.setItem('vote_rating_users', JSON.stringify(existingUsers));
    
    // 设置为当前用户
    localStorage.setItem('vote_rating_current_user', JSON.stringify(newUser));
    setUser(newUser);
    
    return newUser;
  };

  return { user, createNewUser };
};

export default function UserAuth({ onClose }: UserAuthProps) {
  const { user, createNewUser } = useLocalUser();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  // 如果用户已登录，不显示认证组件
  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-gray-600 dark:text-gray-300">欢迎, {user.username}</span>
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
          {user.username.charAt(0).toUpperCase()}
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('请输入用户名');
      return;
    }

    if (username.length < 2) {
      setError('用户名至少需要2个字符');
      return;
    }

    createNewUser(username.trim());
    setError('');
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <h2 
        id="auth-form-title"
        className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center"
      >
        欢迎来到 Vote
      </h2>
      
      <form 
        onSubmit={handleSubmit} 
        className="space-y-4"
        aria-labelledby="auth-form-title"
      >
        <div>
          <label 
            htmlFor="username" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            选择用户名
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="请输入用户名"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
            }`}
            autoFocus
            aria-required="true"
            aria-invalid={!!error}
            aria-describedby={error ? 'username-error' : undefined}
            aria-label="用户名输入"
          />
        </div>

        {error && (
          <div 
            id="username-error"
            className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm px-4 py-2 rounded-lg"
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="开始使用"
        >
          开始使用
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        点击按钮即表示您同意我们的
        <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
          服务条款
        </a>
        和
        <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
          隐私政策
        </a>
      </p>
    </div>
  );
}
