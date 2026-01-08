// 内容项管理器 - 处理内容项相关的数据操作

import { generateId } from '../helpers';
import type { Topic, ContentItem } from '../../types';
import { getStorageData, setStorageData, STORAGE_KEYS } from './storageManager';

// 添加内容项到话题
export const addContentItem = (
  topicId: string,
  contentItemData: Omit<
    ContentItem,
    'id' | 'topicId' | 'createdAt' | 'updatedAt'
  >
): ContentItem => {
  const topics = getStorageData<Topic[]>(STORAGE_KEYS.TOPICS) || [];
  const topicIndex = topics.findIndex((topic) => topic.id === topicId);
  if (topicIndex === -1) {
    throw new Error(`Topic with id ${topicId} not found`);
  }

  const now = new Date();
  const newContentItem: ContentItem = {
    ...contentItemData,
    id: generateId(),
    topicId,
    createdAt: now,
    updatedAt: now,
  };

  topics[topicIndex].contentItems.push(newContentItem);
  topics[topicIndex].updatedAt = now;

  setStorageData(STORAGE_KEYS.TOPICS, topics);
  return newContentItem;
};

// 更新内容项
export const updateContentItem = (
  topicId: string,
  contentItemId: string,
  contentItemData: Partial<
    Omit<ContentItem, 'id' | 'topicId' | 'createdAt'>
  >
): ContentItem | undefined => {
  const topics = getStorageData<Topic[]>(STORAGE_KEYS.TOPICS) || [];
  const topicIndex = topics.findIndex((topic) => topic.id === topicId);
  if (topicIndex === -1) return undefined;

  const contentItemIndex = topics[topicIndex].contentItems.findIndex(
    (item) => item.id === contentItemId
  );
  if (contentItemIndex === -1) return undefined;

  const updatedContentItem = {
    ...topics[topicIndex].contentItems[contentItemIndex],
    ...contentItemData,
    updatedAt: new Date(),
  };

  topics[topicIndex].contentItems[contentItemIndex] = updatedContentItem;
  topics[topicIndex].updatedAt = new Date();

  setStorageData(STORAGE_KEYS.TOPICS, topics);
  return updatedContentItem;
};

// 删除内容项
export const deleteContentItem = (
  topicId: string,
  contentItemId: string
): boolean => {
  const topics = getStorageData<Topic[]>(STORAGE_KEYS.TOPICS) || [];
  const topicIndex = topics.findIndex((topic) => topic.id === topicId);
  if (topicIndex === -1) return false;

  const initialLength = topics[topicIndex].contentItems.length;
  topics[topicIndex].contentItems = topics[topicIndex].contentItems.filter(
    (item) => item.id !== contentItemId
  );
  
  // 删除相关的评分和评论
  topics[topicIndex].ratings = topics[topicIndex].ratings.filter(
    (rating) => rating.contentItemId !== contentItemId
  );
  
  topics[topicIndex].comments = topics[topicIndex].comments.filter(
    (comment) => comment.contentItemId !== contentItemId
  );

  if (topics[topicIndex].contentItems.length === initialLength) return false;

  topics[topicIndex].updatedAt = new Date();
  setStorageData(STORAGE_KEYS.TOPICS, topics);
  return true;
};
