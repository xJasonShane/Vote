// TopicContext - 管理话题相关的全局状态

import React, { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import type { Topic } from '../types';
import { getTopics as fetchTopics, createTopic, updateTopic, deleteTopic } from '../utils/dataManager';

interface TopicContextType {
  topics: Topic[];
  loading: boolean;
  error: string | null;
  fetchTopics: () => Promise<void>;
  createTopic: (topicData: Omit<Topic, 'id' | 'createdAt' | 'updatedAt' | 'contentItems' | 'ratings' | 'comments'>) => Promise<Topic>;
  updateTopic: (id: string, topicData: Partial<Omit<Topic, 'id' | 'createdAt' | 'contentItems' | 'ratings' | 'comments'>>) => Promise<Topic | undefined>;
  deleteTopic: (id: string) => Promise<boolean>;
}

// 创建 Context
const TopicContext = createContext<TopicContextType | undefined>(undefined);

interface TopicProviderProps {
  children: ReactNode;
}

// 创建 Provider 组件
export const TopicProvider: React.FC<TopicProviderProps> = ({ children }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 初始化加载话题数据
  const loadTopics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = fetchTopics();
      setTopics(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '加载话题失败';
      setError(errorMessage);
      console.error('Error loading topics:', err);
    } finally {
      setLoading(false);
    }
  };

  // 创建话题
  const handleCreateTopic = async (topicData: Omit<Topic, 'id' | 'createdAt' | 'updatedAt' | 'contentItems' | 'ratings' | 'comments'>) => {
    try {
      setError(null);
      const newTopic = createTopic(topicData);
      setTopics(prev => [...prev, newTopic]);
      return newTopic;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '创建话题失败';
      setError(errorMessage);
      console.error('Error creating topic:', err);
      throw err;
    }
  };

  // 更新话题
  const handleUpdateTopic = async (id: string, topicData: Partial<Omit<Topic, 'id' | 'createdAt' | 'contentItems' | 'ratings' | 'comments'>>) => {
    try {
      setError(null);
      const updatedTopic = updateTopic(id, topicData);
      if (updatedTopic) {
        setTopics(prev => prev.map(topic => topic.id === id ? updatedTopic : topic));
      }
      return updatedTopic;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新话题失败';
      setError(errorMessage);
      console.error('Error updating topic:', err);
      throw err;
    }
  };

  // 删除话题
  const handleDeleteTopic = async (id: string) => {
    try {
      setError(null);
      const success = deleteTopic(id);
      if (success) {
        setTopics(prev => prev.filter(topic => topic.id !== id));
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '删除话题失败';
      setError(errorMessage);
      console.error('Error deleting topic:', err);
      throw err;
    }
  };

  // 初始加载
  useEffect(() => {
    loadTopics();
  }, []);

  const contextValue: TopicContextType = {
    topics,
    loading,
    error,
    fetchTopics: loadTopics,
    createTopic: handleCreateTopic,
    updateTopic: handleUpdateTopic,
    deleteTopic: handleDeleteTopic,
  };

  return (
    <TopicContext.Provider value={contextValue}>
      {children}
    </TopicContext.Provider>
  );
};

// 自定义 Hook，方便使用 Context
export const useTopics = (): TopicContextType => {
  const context = useContext(TopicContext);
  if (context === undefined) {
    throw new Error('useTopics must be used within a TopicProvider');
  }
  return context;
};
