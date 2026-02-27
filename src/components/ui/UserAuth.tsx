import React, { useState, useEffect } from 'react';
import { getCurrentUser, clearCurrentUser, createUser } from '../../utils/managers/userManager';

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

export default function UserAuth({ onClose }: UserAuthProps) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleCreateUser = (username: string) => {
    const newUser = createUser(username);
    setUser(newUser);
    setError('');
    if (onClose) {
      onClose();
    }
  };

  const handleLogout = () => {
    clearCurrentUser();
    setUser(null);
    setIsDropdownOpen(false);
  };

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

    if (username.length > 20) {
      setError('用户名不能超过20个字符');
      return;
    }

    handleCreateUser(username.trim());
  };

  if (user) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
        >
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <span className="text-gray-700 dark:text-gray-300 font-medium hidden sm:inline">
            {user.username}
          </span>
          <svg 
            className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isDropdownOpen && (
          <>
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsDropdownOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  创建于 {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                </p>
              </div>
              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  退出登录
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

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
            onChange={(e) => {
              setUsername(e.target.value);
              setError('');
            }}
            placeholder="请输入用户名"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
            }`}
            autoFocus
            aria-required="true"
            aria-invalid={!!error}
            aria-describedby={error ? 'username-error' : undefined}
            aria-label="用户名输入"
            maxLength={20}
          />
          <div className="flex justify-between mt-1">
            {error && (
              <p id="username-error" className="text-sm text-red-500">
                {error}
              </p>
            )}
            <p className="text-xs text-gray-400 ml-auto">
              {username.length}/20
            </p>
          </div>
        </div>

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
