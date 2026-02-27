import React, { useState } from 'react';
import DarkModeToggle from '../ui/DarkModeToggle';
import UserAuth from '../ui/UserAuth';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full">
      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="btn-icon text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
          aria-label={isMenuOpen ? '关闭菜单' : '打开菜单'}
          aria-expanded={isMenuOpen}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>
      </div>

      <ul className="hidden md:flex items-center justify-between space-x-2 text-base font-medium">
        <div className="flex items-center space-x-2">
          <li>
            <a 
              href="/" 
              className="nav-link"
              aria-label="首页"
            >
              首页
            </a>
          </li>
          <li>
            <a 
              href="/topics" 
              className="nav-link"
              aria-label="话题列表"
            >
              话题
            </a>
          </li>
          <li>
            <a
              href="/create-topic"
              className="btn btn-primary text-sm px-5 py-2.5"
              aria-label="创建新话题"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              创建话题
            </a>
          </li>
        </div>
        
        <div className="flex items-center space-x-3">
          <li>
            <DarkModeToggle />
          </li>
          <li>
            <UserAuth />
          </li>
        </div>
      </ul>

      {isMenuOpen && (
        <div className="md:hidden mt-4 animate-fade-in-down">
          <div className="glass-card p-6 space-y-4">
            <a
              href="/"
              className="block nav-link"
              aria-label="首页"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              首页
            </a>
            <a
              href="/topics"
              className="block nav-link"
              aria-label="话题列表"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              话题
            </a>
            <a
              href="/create-topic"
              className="btn btn-primary w-full justify-center"
              aria-label="创建新话题"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              创建话题
            </a>
            <div className="divider"></div>
            <div className="flex items-center justify-between">
              <DarkModeToggle />
              <UserAuth />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
