import { generateId, getRandomUserId } from './helpers';
import type { Topic, ContentItem, Rating, Comment, Reply } from '../types';

// 数据存储键名
const STORAGE_KEYS = {
  TOPICS: 'vote_rating_topics',
  CONTENT_ITEMS: 'vote_rating_content_items',
  RATINGS: 'vote_rating_ratings',
  COMMENTS: 'vote_rating_comments',
  REPLIES: 'vote_rating_replies'
} as const;

// 获取所有话题
export const getTopics = (): Topic[] => {
  // 在服务器端渲染时，localStorage不存在，返回空数组
  if (typeof localStorage === 'undefined') {
    return [];
  }
  const topicsJson = localStorage.getItem(STORAGE_KEYS.TOPICS);
  return topicsJson ? JSON.parse(topicsJson) : [];
};

// 获取单个话题
export const getTopic = (id: string): Topic | undefined => {
  const topics = getTopics();
  return topics.find(topic => topic.id === id);
};

// 创建话题
export const createTopic = (topicData: Omit<Topic, 'id' | 'createdAt' | 'updatedAt' | 'contentItems' | 'ratings' | 'comments'>): Topic => {
  // 在服务器端渲染时，localStorage不存在，返回新话题但不保存
  if (typeof localStorage === 'undefined') {
    const now = new Date();
    return {
      ...topicData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
      contentItems: [],
      ratings: [],
      comments: []
    };
  }
  
  const topics = getTopics();
  const now = new Date();
  const newTopic: Topic = {
    ...topicData,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
    contentItems: [],
    ratings: [],
    comments: []
  };
  const updatedTopics = [...topics, newTopic];
  localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(updatedTopics));
  return newTopic;
};

// 更新话题
export const updateTopic = (id: string, topicData: Partial<Omit<Topic, 'id' | 'createdAt' | 'contentItems' | 'ratings' | 'comments'>>): Topic | undefined => {
  // 在服务器端渲染时，localStorage不存在，返回undefined
  if (typeof localStorage === 'undefined') {
    return undefined;
  }
  
  const topics = getTopics();
  const topicIndex = topics.findIndex(topic => topic.id === id);
  if (topicIndex === -1) return undefined;
  
  const updatedTopic = {
    ...topics[topicIndex],
    ...topicData,
    updatedAt: new Date()
  };
  
  topics[topicIndex] = updatedTopic;
  localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(topics));
  return updatedTopic;
};

// 删除话题
export const deleteTopic = (id: string): boolean => {
  // 在服务器端渲染时，localStorage不存在，返回false
  if (typeof localStorage === 'undefined') {
    return false;
  }
  
  const topics = getTopics();
  const updatedTopics = topics.filter(topic => topic.id !== id);
  if (updatedTopics.length === topics.length) return false;
  
  localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(updatedTopics));
  return true;
};

// 添加内容项到话题
export const addContentItem = (topicId: string, contentItemData: Omit<ContentItem, 'id' | 'topicId' | 'createdAt' | 'updatedAt'>): ContentItem => {
  // 在服务器端渲染时，localStorage不存在，返回新内容项但不保存
  if (typeof localStorage === 'undefined') {
    const now = new Date();
    return {
      ...contentItemData,
      id: generateId(),
      topicId,
      createdAt: now,
      updatedAt: now
    };
  }
  
  const topics = getTopics();
  const topicIndex = topics.findIndex(topic => topic.id === topicId);
  if (topicIndex === -1) {
    throw new Error(`Topic with id ${topicId} not found`);
  }
  
  const now = new Date();
  const newContentItem: ContentItem = {
    ...contentItemData,
    id: generateId(),
    topicId,
    createdAt: now,
    updatedAt: now
  };
  
  topics[topicIndex].contentItems.push(newContentItem);
  topics[topicIndex].updatedAt = now;
  
  localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(topics));
  return newContentItem;
};

// 为内容项添加评分
export const addRating = (topicId: string, contentItemId: string, score: number, dimensions?: { [key: string]: number }): Rating => {
  // 在服务器端渲染时，localStorage不存在，返回新评分但不保存
  if (typeof localStorage === 'undefined') {
    const now = new Date();
    const userId = getRandomUserId();
    return {
      id: generateId(),
      topicId,
      contentItemId,
      userId,
      score,
      dimensions,
      createdAt: now
    };
  }
  
  const topics = getTopics();
  const topicIndex = topics.findIndex(topic => topic.id === topicId);
  if (topicIndex === -1) {
    throw new Error(`Topic with id ${topicId} not found`);
  }
  
  const contentItemIndex = topics[topicIndex].contentItems.findIndex(item => item.id === contentItemId);
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
    createdAt: now
  };
  
  topics[topicIndex].ratings.push(newRating);
  topics[topicIndex].updatedAt = now;
  
  localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(topics));
  return newRating;
};

// 添加评论
export const addComment = (topicId: string, content: string, contentItemId?: string): Comment => {
  // 在服务器端渲染时，localStorage不存在，返回新评论但不保存
  if (typeof localStorage === 'undefined') {
    const now = new Date();
    const userId = getRandomUserId();
    return {
      id: generateId(),
      topicId,
      contentItemId,
      userId,
      content,
      replies: [],
      likes: 0,
      createdAt: now,
      updatedAt: now
    };
  }
  
  const topics = getTopics();
  const topicIndex = topics.findIndex(topic => topic.id === topicId);
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
    updatedAt: now
  };
  
  topics[topicIndex].comments.push(newComment);
  topics[topicIndex].updatedAt = now;
  
  localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(topics));
  return newComment;
};

// 添加评论回复
export const addReply = (topicId: string, commentId: string, content: string): Reply => {
  // 在服务器端渲染时，localStorage不存在，返回新回复但不保存
  if (typeof localStorage === 'undefined') {
    const now = new Date();
    const userId = getRandomUserId();
    return {
      id: generateId(),
      commentId,
      userId,
      content,
      likes: 0,
      createdAt: now,
      updatedAt: now
    };
  }
  
  const topics = getTopics();
  const topicIndex = topics.findIndex(topic => topic.id === topicId);
  if (topicIndex === -1) {
    throw new Error(`Topic with id ${topicId} not found`);
  }
  
  const commentIndex = topics[topicIndex].comments.findIndex(comment => comment.id === commentId);
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
    updatedAt: now
  };
  
  topics[topicIndex].comments[commentIndex].replies.push(newReply);
  topics[topicIndex].comments[commentIndex].updatedAt = now;
  topics[topicIndex].updatedAt = now;
  
  localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(topics));
  return newReply;
};

// 点赞评论
export const likeComment = (topicId: string, commentId: string): boolean => {
  // 在服务器端渲染时，localStorage不存在，返回false
  if (typeof localStorage === 'undefined') {
    return false;
  }
  
  const topics = getTopics();
  const topicIndex = topics.findIndex(topic => topic.id === topicId);
  if (topicIndex === -1) return false;
  
  const commentIndex = topics[topicIndex].comments.findIndex(comment => comment.id === commentId);
  if (commentIndex === -1) return false;
  
  topics[topicIndex].comments[commentIndex].likes += 1;
  topics[topicIndex].comments[commentIndex].updatedAt = new Date();
  topics[topicIndex].updatedAt = new Date();
  
  localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(topics));
  return true;
};