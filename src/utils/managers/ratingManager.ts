// 评分管理器 - 处理评分相关的数据操作

import { generateId } from '../helpers';
import type { Topic, Rating } from '../../types';
import { getStorageData, setStorageData, STORAGE_KEYS } from './storageManager';
import { getCurrentUser } from './userManager';

// 为内容项添加评分（带用户验证和防重复）
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

  // 获取当前用户
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('请先登录后再评分');
  }

  // 检查是否已评分
  const existingRatingIndex = topics[topicIndex].ratings.findIndex(
    (rating) => rating.contentItemId === contentItemId && rating.userId === currentUser.id
  );

  const now = new Date();
  
  if (existingRatingIndex !== -1) {
    // 更新已有评分
    topics[topicIndex].ratings[existingRatingIndex] = {
      ...topics[topicIndex].ratings[existingRatingIndex],
      score,
      dimensions,
    };
    topics[topicIndex].updatedAt = now;
    setStorageData(STORAGE_KEYS.TOPICS, topics);
    return topics[topicIndex].ratings[existingRatingIndex];
  }

  // 创建新评分
  const newRating: Rating = {
    id: generateId(),
    topicId,
    contentItemId,
    userId: currentUser.id,
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

// 获取当前用户对内容项的评分
export const getCurrentUserRating = (
  topicId: string,
  contentItemId: string
): Rating | undefined => {
  const currentUser = getCurrentUser();
  if (!currentUser) return undefined;
  
  return getUserRating(topicId, contentItemId, currentUser.id);
};
