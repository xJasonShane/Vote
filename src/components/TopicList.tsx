import { useState, useEffect } from 'react';
import type { Topic } from '../types';
import { formatDate } from '../utils/helpers';
import SearchBar from './SearchBar';

type SortOption = 'latest' | 'oldest' | 'mostContent' | 'mostRatings' | 'mostComments';

interface TopicListProps {
  initialTopics: Topic[];
}

export default function TopicList({ initialTopics }: TopicListProps) {
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>(initialTopics);
  const [sortOption, setSortOption] = useState<SortOption>('latest');

  useEffect(() => {
    setTopics(initialTopics);
    sortTopics(initialTopics, sortOption);
  }, [initialTopics, sortOption]);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      sortTopics(topics, sortOption);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = topics.filter(topic => 
      topic.title.toLowerCase().includes(lowercaseQuery) ||
      topic.description.toLowerCase().includes(lowercaseQuery) ||
      topic.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      topic.creator.toLowerCase().includes(lowercaseQuery)
    );
    sortTopics(filtered, sortOption);
  };

  const sortTopics = (topicsToSort: Topic[], option: SortOption) => {
    let sorted = [...topicsToSort];
    
    switch (option) {
      case 'latest':
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'mostContent':
        sorted.sort((a, b) => b.contentItems.length - a.contentItems.length);
        break;
      case 'mostRatings':
        sorted.sort((a, b) => b.ratings.length - a.ratings.length);
        break;
      case 'mostComments':
        sorted.sort((a, b) => b.comments.length - a.comments.length);
        break;
    }
    
    setFilteredTopics(sorted);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const option = e.target.value as SortOption;
    setSortOption(option);
    sortTopics(filteredTopics, option);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <SearchBar onSearch={handleSearch} />
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium text-gray-700 dark:text-gray-300">排序:</label>
          <select
            id="sort"
            value={sortOption}
            onChange={handleSortChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option value="latest">最新创建</option>
            <option value="oldest">最早创建</option>
            <option value="mostContent">最多内容项</option>
            <option value="mostRatings">最多评分</option>
            <option value="mostComments">最多评论</option>
          </select>
        </div>
      </div>
      
      {filteredTopics.length === 0 ? (
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-12 text-center border border-blue-100">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-3 text-gray-800">未找到匹配的话题</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">尝试使用其他关键词搜索，或创建一个新的话题</p>
          <a 
            href="/create-topic" 
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            创建新话题
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredTopics.map(topic => (
            <div 
              key={topic.id} 
              className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 border border-gray-100 hover:border-blue-200 relative overflow-hidden group"
            >
              {/* 装饰性背景元素 */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100 rounded-full -mr-20 -mt-20 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    <a 
                      href={`/topics/detail?id=${topic.id}`} 
                      className="hover:text-blue-600 transition-colors group-hover:underline group-hover:underline-offset-4"
                    >
                      {topic.title}
                    </a>
                  </h3>
                  <span className="text-sm text-gray-500 bg-white bg-opacity-80 backdrop-blur-sm px-3 py-1 rounded-full">{formatDate(topic.createdAt)}</span>
                </div>
                
                <p className="text-gray-600 mb-5 line-clamp-3 leading-relaxed">{topic.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {topic.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-medium hover:from-blue-200 hover:to-blue-300 transition-colors duration-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">创建者:</span> {topic.creator}
                  </div>
                  
                  <div className="flex space-x-6 text-sm">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      <span className="text-gray-600">{topic.contentItems.length}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                      <span className="text-gray-600">{topic.ratings.length}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                      </svg>
                      <span className="text-gray-600">{topic.comments.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}