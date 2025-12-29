// 话题类型
export interface Topic {
  id: string;
  title: string;
  description: string;
  creator: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  contentItems: ContentItem[];
  ratings: Rating[];
  comments: Comment[];
}

// 内容项类型（角色/项目等）
export interface ContentItem {
  id: string;
  topicId: string;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 评分类型
export interface Rating {
  id: string;
  topicId: string;
  contentItemId: string;
  userId: string;
  score: number;
  dimensions?: {
    [key: string]: number;
  };
  createdAt: Date;
}

// 评论类型
export interface Comment {
  id: string;
  topicId: string;
  contentItemId?: string;
  userId: string;
  content: string;
  replies: Reply[];
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

// 评论回复类型
export interface Reply {
  id: string;
  commentId: string;
  userId: string;
  content: string;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

// 用户类型
export interface User {
  id: string;
  username: string;
  email?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
