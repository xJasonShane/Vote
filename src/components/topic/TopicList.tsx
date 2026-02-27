import React, { useState, useEffect, useCallback } from 'react';
import type { Topic } from '../../types';
import { formatDate } from '../../utils/helpers';
import SearchBar from '../shared/SearchBar';

type SortOption = 'latest' | 'oldest' | 'mostContent' | 'mostRatings' | 'mostComments';

interface TopicListProps {
  initialTopics: Topic[];
}

const TopicList = React.memo(({ initialTopics }: TopicListProps) => {
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>(initialTopics);
  const [sortOption, setSortOption] = useState<SortOption>('latest');

  const sortTopics = useCallback((topicsToSort: Topic[], option: SortOption) => {
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
  }, []);

  const handleSearch = useCallback((query: string) => {
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
  }, [topics, sortOption, sortTopics]);

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const option = e.target.value as SortOption;
    setSortOption(option);
    sortTopics(filteredTopics, option);
  }, [filteredTopics, sortTopics]);

  useEffect(() => {
    setTopics(initialTopics);
    sortTopics(initialTopics, sortOption);
  }, [initialTopics, sortOption, sortTopics]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <SearchBar onSearch={handleSearch} />
        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="text-sm font-medium text-slate-700 dark:text-slate-300">排序:</label>
          <select
            id="sort"
            value={sortOption}
            onChange={handleSortChange}
            className="input-field w-auto"
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
        <div className="glass-card p-16 text-center animate-fade-in">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <svg className="w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-3 text-slate-800 dark:text-slate-100">未找到匹配的话题</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">尝试使用其他关键词搜索，或创建一个新的话题</p>
          <a 
            href="/create-topic" 
            className="btn btn-primary"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            创建新话题
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTopics.map((topic, index) => (
            <div 
              key={topic.id} 
              className="card p-6 group cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      <a 
                        href={`/topics/detail?id=${topic.id}`} 
                        className="hover:underline underline-offset-4 decoration-2 decoration-blue-500/30"
                      >
                        {topic.title}
                      </a>
                    </h3>
                    <span className="badge badge-primary shrink-0 ml-3">
                      {formatDate(topic.createdAt)}
                    </span>
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-400 mb-5 line-clamp-3 leading-relaxed">{topic.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-5">
                    {topic.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="tag text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                    <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{topic.creator}</span>
                    </div>
                    
                    <div className="flex space-x-5 text-sm">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        <span className="font-medium">{topic.contentItems.length}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <span className="font-medium">{topic.ratings.length}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                        </svg>
                        <span className="font-medium">{topic.comments.length}</span>
                      </div>
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
});

export default TopicList;
