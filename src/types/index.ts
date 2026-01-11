/**
 * 话题类型定义
 * 代表一个投票/评分话题，包含相关的内容项、评分和评论
 */
export interface Topic {
  /** 话题唯一标识符 */
  id: string;
  /** 话题标题 */
  title: string;
  /** 话题描述 */
  description: string;
  /** 话题创建者用户名 */
  creator: string;
  /** 话题创建时间 */
  createdAt: Date;
  /** 话题更新时间 */
  updatedAt: Date;
  /** 话题标签列表 */
  tags: string[];
  /** 话题包含的内容项列表 */
  contentItems: ContentItem[];
  /** 话题收到的评分列表 */
  ratings: Rating[];
  /** 话题收到的评论列表 */
  comments: Comment[];
}

/**
 * 内容项类型定义
 * 代表话题下的具体内容，如角色、项目、产品等需要被评分的对象
 */
export interface ContentItem {
  /** 内容项唯一标识符 */
  id: string;
  /** 所属话题ID */
  topicId: string;
  /** 内容项标题 */
  title: string;
  /** 内容项描述 */
  description: string;
  /** 内容项图片URL（可选） */
  imageUrl?: string;
  /** 内容项创建时间 */
  createdAt: Date;
  /** 内容项更新时间 */
  updatedAt: Date;
}

/**
 * 评分类型定义
 * 代表用户对某个内容项的评分
 */
export interface Rating {
  /** 评分唯一标识符 */
  id: string;
  /** 所属话题ID */
  topicId: string;
  /** 被评分的内容项ID */
  contentItemId: string;
  /** 评分用户ID */
  userId: string;
  /** 总体评分（1-5分） */
  score: number;
  /** 维度评分（可选），如不同方面的细分评分 */
  dimensions?: {
    [key: string]: number;
  };
  /** 评分创建时间 */
  createdAt: Date;
}

/**
 * 评论类型定义
 * 代表用户对话题或内容项的评论
 */
export interface Comment {
  /** 评论唯一标识符 */
  id: string;
  /** 所属话题ID */
  topicId: string;
  /** 所属内容项ID（可选），如果评论针对的是特定内容项 */
  contentItemId?: string;
  /** 评论用户ID */
  userId: string;
  /** 评论内容 */
  content: string;
  /** 评论的回复列表 */
  replies: Reply[];
  /** 评论点赞数 */
  likes: number;
  /** 评论创建时间 */
  createdAt: Date;
  /** 评论更新时间 */
  updatedAt: Date;
}

/**
 * 回复类型定义
 * 代表对评论的回复
 */
export interface Reply {
  /** 回复唯一标识符 */
  id: string;
  /** 所属评论ID */
  commentId: string;
  /** 回复用户ID */
  userId: string;
  /** 回复内容 */
  content: string;
  /** 回复点赞数 */
  likes: number;
  /** 回复创建时间 */
  createdAt: Date;
  /** 回复更新时间 */
  updatedAt: Date;
}

/**
 * 用户类型定义
 * 代表系统中的用户
 */
export interface User {
  /** 用户唯一标识符 */
  id: string;
  /** 用户名 */
  username: string;
  /** 用户邮箱（可选） */
  email?: string;
  /** 用户头像URL（可选） */
  avatarUrl?: string;
  /** 用户注册时间 */
  createdAt: Date;
  /** 用户信息更新时间 */
  updatedAt: Date;
  /** 用户收藏的话题ID列表 */
  favorites: string[];
}
