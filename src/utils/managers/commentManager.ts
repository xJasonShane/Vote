// 评论管理器 - 处理评论和回复相关的数据操作

import { generateId, getRandomUserId } from '../helpers';
import type { Topic, Comment, Reply } from '../../types';
import { getStorageData, setStorageData, STORAGE_KEYS } from './storageManager';

// 添加评论
export const addComment = (
  topicId: string,
  content: string,
  contentItemId?: string
): Comment => {
  const topics = getStorageData<Topic[]>(STORAGE_KEYS.TOPICS) || [];
  const topicIndex = topics.findIndex((topic) => topic.id === topicId);
  if (topicIndex === -1) {
    throw new Error(`Topic with id ${topicId} not found`);
  }

  const now = new Date();
  const userId = getRandomUserId();
  const newComment: Comment = {
    id: generateId(),
    topicId,
    contentItemId,
    userId,
    content,
    replies: [],
    likes: 0,
    createdAt: now,
    updatedAt: now,
  };

  topics[topicIndex].comments.push(newComment);
  topics[topicIndex].updatedAt = now;

  setStorageData(STORAGE_KEYS.TOPICS, topics);
  return newComment;
};

// 添加评论回复
export const addReply = (
  topicId: string,
  commentId: string,
  content: string
): Reply => {
  const topics = getStorageData<Topic[]>(STORAGE_KEYS.TOPICS) || [];
  const topicIndex = topics.findIndex((topic) => topic.id === topicId);
  if (topicIndex === -1) {
    throw new Error(`Topic with id ${topicId} not found`);
  }

  const commentIndex = topics[topicIndex].comments.findIndex(
    (comment) => comment.id === commentId
  );
  if (commentIndex === -1) {
    throw new Error(`Comment with id ${commentId} not found`);
  }

  const now = new Date();
  const userId = getRandomUserId();
  const newReply: Reply = {
    id: generateId(),
    commentId,
    userId,
    content,
    likes: 0,
    createdAt: now,
    updatedAt: now,
  };

  topics[topicIndex].comments[commentIndex].replies.push(newReply);
  topics[topicIndex].comments[commentIndex].updatedAt = now;
  topics[topicIndex].updatedAt = now;

  setStorageData(STORAGE_KEYS.TOPICS, topics);
  return newReply;
};

// 点赞评论
export const likeComment = (topicId: string, commentId: string): boolean => {
  const topics = getStorageData<Topic[]>(STORAGE_KEYS.TOPICS) || [];
  const topicIndex = topics.findIndex((topic) => topic.id === topicId);
  if (topicIndex === -1) return false;

  const commentIndex = topics[topicIndex].comments.findIndex(
    (comment) => comment.id === commentId
  );
  if (commentIndex === -1) return false;

  topics[topicIndex].comments[commentIndex].likes += 1;
  topics[topicIndex].comments[commentIndex].updatedAt = new Date();
  topics[topicIndex].updatedAt = new Date();

  setStorageData(STORAGE_KEYS.TOPICS, topics);
  return true;
};

// 点赞回复
export const likeReply = (topicId: string, commentId: string, replyId: string): boolean => {
  const topics = getStorageData<Topic[]>(STORAGE_KEYS.TOPICS) || [];
  const topicIndex = topics.findIndex((topic) => topic.id === topicId);
  if (topicIndex === -1) return false;

  const commentIndex = topics[topicIndex].comments.findIndex(
    (comment) => comment.id === commentId
  );
  if (commentIndex === -1) return false;

  const replyIndex = topics[topicIndex].comments[commentIndex].replies.findIndex(
    (reply) => reply.id === replyId
  );
  if (replyIndex === -1) return false;

  topics[topicIndex].comments[commentIndex].replies[replyIndex].likes += 1;
  topics[topicIndex].comments[commentIndex].replies[replyIndex].updatedAt = new Date();
  topics[topicIndex].comments[commentIndex].updatedAt = new Date();
  topics[topicIndex].updatedAt = new Date();

  setStorageData(STORAGE_KEYS.TOPICS, topics);
  return true;
};
