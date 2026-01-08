// 话题管理器 - 处理话题相关的数据操作

import { generateId } from '../helpers';
import type { Topic } from '../../types';
import { getStorageData, setStorageData, STORAGE_KEYS } from './storageManager';

// 获取所有话题
export const getTopics = (): Topic[] => {
  const topics = getStorageData<Topic[]>(STORAGE_KEYS.TOPICS);
  return topics || [];
};

// 获取单个话题
export const getTopic = (id: string): Topic | undefined => {
  const topics = getTopics();
  return topics.find((topic) => topic.id === id);
};

// 创建话题
export const createTopic = (
  topicData: Omit<
    Topic,
    'id' | 'createdAt' | 'updatedAt' | 'contentItems' | 'ratings' | 'comments'
  >
): Topic => {
  const topics = getTopics();
  const now = new Date();
  const newTopic: Topic = {
    ...topicData,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
    contentItems: [],
    ratings: [],
    comments: [],
  };
  const updatedTopics = [...topics, newTopic];
  setStorageData(STORAGE_KEYS.TOPICS, updatedTopics);
  return newTopic;
};

// 更新话题
export const updateTopic = (
  id: string,
  topicData: Partial<
    Omit<Topic, 'id' | 'createdAt' | 'contentItems' | 'ratings' | 'comments'>
  >
): Topic | undefined => {
  const topics = getTopics();
  const topicIndex = topics.findIndex((topic) => topic.id === id);
  if (topicIndex === -1) return undefined;

  const updatedTopic = {
    ...topics[topicIndex],
    ...topicData,
    updatedAt: new Date(),
  };

  topics[topicIndex] = updatedTopic;
  setStorageData(STORAGE_KEYS.TOPICS, topics);
  return updatedTopic;
};

// 删除话题
export const deleteTopic = (id: string): boolean => {
  const topics = getTopics();
  const updatedTopics = topics.filter((topic) => topic.id !== id);
  if (updatedTopics.length === topics.length) return false;

  setStorageData(STORAGE_KEYS.TOPICS, updatedTopics);
  return true;
};
