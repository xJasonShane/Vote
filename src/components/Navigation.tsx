import React from 'react';

const Navigation: React.FC = () => {
  return (
    <nav>
      <ul className="flex space-x-6">
        <li>
          <a href="/" className="hover:text-blue-600 transition-colors">
            首页
          </a>
        </li>
        <li>
          <a href="/topics" className="hover:text-blue-600 transition-colors">
            话题
          </a>
        </li>
        <li>
          <a
            href="/create-topic"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            创建话题
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
