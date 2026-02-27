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
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleCreateUser = (username: string) => {
    const newUser = createUser(username);
    setUser(newUser);
    setError('');
    setShowLoginModal(false);
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
          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
        >
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm shadow-lg">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <span className="text-slate-700 dark:text-slate-300 font-medium hidden sm:inline">
            {user.username}
          </span>
          <svg 
            className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
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
            <div className="absolute right-0 mt-2 w-56 glass-card p-2 z-50 animate-fade-in-down">
              <div className="px-3 py-3 border-b border-slate-200/50 dark:border-slate-700/50 mb-2">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user.username}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  创建于 {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                退出登录
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowLoginModal(true)}
        className="btn btn-primary text-sm px-4 py-2"
        aria-label="登录"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
        登录
      </button>

      {showLoginModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" 
          onClick={() => {
            setShowLoginModal(false);
            setError('');
            setUsername('');
          }}
        >
          <div 
            className="glass-card p-8 w-full max-w-md animate-scale-in" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 
                id="auth-form-title"
                className="text-2xl font-bold gradient-text"
              >
                欢迎来到 Vote
              </h2>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setError('');
                  setUsername('');
                }}
                className="btn-icon text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                aria-label="关闭"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form 
              onSubmit={handleSubmit} 
              className="space-y-5"
              aria-labelledby="auth-form-title"
            >
              <div>
                <label 
                  htmlFor="username" 
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
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
                  className={`input-field ${
                    error ? 'border-rose-500 dark:border-rose-400 focus:ring-rose-500' : ''
                  }`}
                  autoFocus
                  aria-required="true"
                  aria-invalid={!!error}
                  aria-describedby={error ? 'username-error' : undefined}
                  aria-label="用户名输入"
                  maxLength={20}
                />
                <div className="flex justify-between mt-2">
                  {error && (
                    <p id="username-error" className="text-sm text-rose-500 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {error}
                    </p>
                  )}
                  <p className="text-xs text-slate-400 ml-auto">
                    {username.length}/20
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                aria-label="开始使用"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                开始使用
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
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
        </div>
      )}
    </>
  );
}
