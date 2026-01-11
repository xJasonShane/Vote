import React, { useState } from 'react';
import DarkModeToggle from './DarkModeToggle';
import UserAuth from './UserAuth';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full">
      {/* 移动设备菜单按钮 */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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

      {/* 桌面设备导航 */}
      <ul className="hidden md:flex items-center justify-between space-x-8 text-base font-medium">
        <div className="flex items-center space-x-8">
          <li>
            <a 
              href="/" 
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30"
              aria-label="首页"
            >
              首页
            </a>
          </li>
          <li>
            <a 
              href="/topics" 
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30"
              aria-label="话题列表"
            >
              话题
            </a>
          </li>
          <li>
            <a
              href="/create-topic"
              className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="创建新话题"
            >
              创建话题
            </a>
          </li>
        </div>
        
        <div className="flex items-center space-x-6">
          <li>
            <DarkModeToggle />
          </li>
          <li>
            <UserAuth />
          </li>
        </div>
      </ul>

      {/* 移动设备导航菜单 */}
      {isMenuOpen && (
        <div className="md:hidden mt-4">
          <div className="flex flex-col space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <a
              href="/"
              className="block py-2 px-4 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200"
              aria-label="首页"
              onClick={() => setIsMenuOpen(false)}
            >
              首页
            </a>
            <a
              href="/topics"
              className="block py-2 px-4 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200"
              aria-label="话题列表"
              onClick={() => setIsMenuOpen(false)}
            >
              话题
            </a>
            <a
              href="/create-topic"
              className="block py-2 px-4 rounded-md bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white text-center hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900 transition-all duration-200 shadow-md"
              aria-label="创建新话题"
              onClick={() => setIsMenuOpen(false)}
            >
              创建话题
            </a>
            <div className="flex items-center justify-between py-2 px-4 border-t border-gray-200 dark:border-gray-700 mt-2">
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
