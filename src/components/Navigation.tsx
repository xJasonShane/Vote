import React from 'react';

const Navigation: React.FC = () => {
  return (
    <nav className="w-full">
      <ul className="flex items-center space-x-8 text-base font-medium">
        <li>
          <a 
            href="/" 
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-blue-50"
            aria-label="首页"
          >
            首页
          </a>
        </li>
        <li>
          <a 
            href="/topics" 
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-blue-50"
            aria-label="话题列表"
          >
            话题
          </a>
        </li>
        <li>
          <a
            href="/create-topic"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="创建新话题"
          >
            创建话题
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
