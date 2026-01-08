// 评分管理器 - 处理评分相关的数据操作

import { generateId, getRandomUserId } from '../helpers';
import type { Topic, Rating } from '../../types';
import { getStorageData, setStorageData, STORAGE_KEYS } from './storageManager';

// 为内容项添加评分
export const addRating = (
  topicId: string,
  contentItemId: string,
  score: number,
  dimensions?: { [key: string]: number }
): Rating => {
  const topics = getStorageData<Topic[]>(STORAGE_KEYS.TOPICS) || [];
  const topicIndex = topics.findIndex((topic) => topic.id === topicId);
  if (topicIndex === -1) {
    throw new Error(`Topic with id ${topicId} not found`);
  }

  const contentItemIndex = topics[topicIndex].contentItems.findIndex(
    (item) => item.id === contentItemId
  );
  if (contentItemIndex === -1) {
    throw new Error(`Content item with id ${contentItemId} not found`);
  }

  const now = new Date();
  const userId = getRandomUserId();
  const newRating: Rating = {
    id: generateId(),
    topicId,
    contentItemId,
    userId,
    score,
    dimensions,
    createdAt: now,
  };

  topics[topicIndex].ratings.push(newRating);
  topics[topicIndex].updatedAt = now;

  setStorageData(STORAGE_KEYS.TOPICS, topics);
  return newRating;
};

// 获取内容项的评分
export const getContentItemRatings = (
  topicId: string,
  contentItemId: string
): Rating[] => {
  const topic = getStorageData<Topic[]>(STORAGE_KEYS.TOPICS)?.find(
    (t) => t.id === topicId
  );
  if (!topic) return [];
  
  return topic.ratings.filter((rating) => rating.contentItemId === contentItemId);
};

// 获取用户对内容项的评分
export const getUserRating = (
  topicId: string,
  contentItemId: string,
  userId: string
): Rating | undefined => {
  const topic = getStorageData<Topic[]>(STORAGE_KEYS.TOPICS)?.find(
    (t) => t.id === topicId
  );
  if (!topic) return undefined;
  
  return topic.ratings.find(
    (rating) => rating.contentItemId === contentItemId && rating.userId === userId
  );
};
