// 评论管理器 - 处理评论和回复相关的数据操作

import { generateId, getRandomUserId } from '../helpers';
import type { Topic, Comment, Reply } from '../../types';
import { getStorageData, setStorageData, STORAGE_KEYS } from './storageManager';

// 添加评论
export const addComment = (
  topicId: string,
  content: string,
  userId: string = getRandomUserId(),
  contentItemId?: string
): Comment => {
  const topics = getStorageData<Topic[]>(STORAGE_KEYS.TOPICS) || [];
  const topicIndex = topics.findIndex((topic) => topic.id === topicId);
  if (topicIndex === -1) {
    throw new Error(`Topic with id ${topicId} not found`);
  }

  const now = new Date();
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

// 辅助函数：根据 commentId 找到对应的 topic 和 comment 索引
const findTopicAndCommentByCommentId = (commentId: string) => {
  const topics = getStorageData<Topic[]>(STORAGE_KEYS.TOPICS) || [];
  
  for (let topicIndex = 0; topicIndex < topics.length; topicIndex++) {
    const commentIndex = topics[topicIndex].comments.findIndex(
      (comment) => comment.id === commentId
    );
    if (commentIndex !== -1) {
      return { topics, topicIndex, commentIndex };
    }
  }
  
  return { topics: null, topicIndex: -1, commentIndex: -1 };
};

// 辅助函数：根据 replyId 找到对应的 topic、comment 和 reply 索引
const findTopicCommentAndReplyByReplyId = (replyId: string) => {
  const topics = getStorageData<Topic[]>(STORAGE_KEYS.TOPICS) || [];
  
  for (let topicIndex = 0; topicIndex < topics.length; topicIndex++) {
    for (let commentIndex = 0; commentIndex < topics[topicIndex].comments.length; commentIndex++) {
      const replyIndex = topics[topicIndex].comments[commentIndex].replies.findIndex(
        (reply) => reply.id === replyId
      );
      if (replyIndex !== -1) {
        return { topics, topicIndex, commentIndex, replyIndex };
      }
    }
  }
  
  return { topics: null, topicIndex: -1, commentIndex: -1, replyIndex: -1 };
};

// 添加评论回复
export const addReply = (
  commentId: string,
  parentReplyId: string,
  content: string,
  userId: string = getRandomUserId()
): Reply => {
  const { topics, topicIndex, commentIndex } = findTopicAndCommentByCommentId(commentId);
  
  if (!topics || topicIndex === -1 || commentIndex === -1) {
    throw new Error(`Comment with id ${commentId} not found`);
  }

  const now = new Date();
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
export const likeComment = (commentId: string): boolean => {
  const { topics, topicIndex, commentIndex } = findTopicAndCommentByCommentId(commentId);
  
  if (!topics || topicIndex === -1 || commentIndex === -1) return false;

  topics[topicIndex].comments[commentIndex].likes += 1;
  topics[topicIndex].comments[commentIndex].updatedAt = new Date();
  topics[topicIndex].updatedAt = new Date();

  setStorageData(STORAGE_KEYS.TOPICS, topics);
  return true;
};

// 点赞回复
export const likeReply = (replyId: string): boolean => {
  const { topics, topicIndex, commentIndex, replyIndex } = findTopicCommentAndReplyByReplyId(replyId);
  
  if (!topics || topicIndex === -1 || commentIndex === -1 || replyIndex === -1) return false;

  topics[topicIndex].comments[commentIndex].replies[replyIndex].likes += 1;
  topics[topicIndex].comments[commentIndex].replies[replyIndex].updatedAt = new Date();
  topics[topicIndex].comments[commentIndex].updatedAt = new Date();
  topics[topicIndex].updatedAt = new Date();

  setStorageData(STORAGE_KEYS.TOPICS, topics);
  return true;
};
