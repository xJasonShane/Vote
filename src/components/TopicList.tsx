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
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <SearchBar onSearch={handleSearch} />
        <div class="flex items-center gap-2">
          <label for="sort" class="text-sm font-medium text-gray-700 dark:text-gray-300">排序:</label>
          <select
            id="sort"
            value={sortOption}
            onChange={handleSortChange}
            class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
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
        <div class="bg-white p-8 rounded-lg shadow-md text-center dark:bg-gray-800 dark:text-white">
          <h3 class="text-xl font-semibold mb-2">未找到匹配的话题</h3>
          <p class="text-gray-600 mb-4 dark:text-gray-300">尝试使用其他关键词搜索</p>
          <a 
            href="/create-topic" 
            class="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            创建新话题
          </a>
        </div>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTopics.map(topic => (
            <div 
              key={topic.id} 
              class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow dark:bg-gray-800 dark:text-white"
            >
              <div class="flex justify-between items-start mb-3">
                <h3 class="text-xl font-semibold">
                  <a 
                    href={`/topics/detail?id=${topic.id}`} 
                    class="hover:text-blue-600 transition-colors dark:hover:text-blue-400"
                  >
                    {topic.title}
                  </a>
                </h3>
                <span class="text-sm text-gray-500 dark:text-gray-400">{formatDate(topic.createdAt)}</span>
              </div>
              <p class="text-gray-600 mb-4 line-clamp-2 dark:text-gray-300">{topic.description}</p>
              <div class="flex flex-wrap gap-2 mb-4">
                {topic.tags.map(tag => (
                  <span 
                    key={tag} 
                    class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm dark:bg-gray-700 dark:text-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div class="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <span>创建者: {topic.creator}</span>
                <div class="flex space-x-4">
                  <span>{topic.contentItems.length} 个内容项</span>
                  <span>{topic.ratings.length} 条评分</span>
                  <span>{topic.comments.length} 条评论</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}