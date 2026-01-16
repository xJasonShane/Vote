import React, { useEffect, useState, useCallback } from 'react';
import { getTopic, getCurrentUser, addFavorite, removeFavorite, isTopicFavorited } from '../../utils/dataManager';
import { formatDate } from '../../utils/helpers';
import ContentItemList from './ContentItemList';
import CommentSection from './CommentSection';
import ShareComponent from '../shared/ShareComponent';
import { SkeletonLoader } from '../shared/Skeleton';
import ErrorBoundary from '../app/ErrorBoundary';
import type { Topic, User } from '../../types';

const TopicDetail: React.FC = () => {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  // 获取当前用户和检查收藏状态
  useEffect(() => {
    const fetchUserData = () => {
      try {
        const user = getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error('获取用户数据失败:', err);
      }
    };

    fetchUserData();
  }, []);

  // 检查话题是否被收藏
  useEffect(() => {
    if (topic && currentUser) {
      const favorited = isTopicFavorited(currentUser.id, topic.id);
      setIsFavorited(favorited);
    }
  }, [topic, currentUser]);

  useEffect(() => {
    // 从URL参数中获取话题ID
    const urlParams = new URLSearchParams(window.location.search);
    const topicId = urlParams.get('id');

    if (!topicId) {
      setError('话题ID不能为空');
      setLoading(false);
      return;
    }

    try {
      const topicData = getTopic(topicId);
      if (topicData) {
        setTopic(topicData);
      } else {
        setError('话题不存在');
      }
    } catch (err) {
      setError('获取话题失败');
      console.error('获取话题失败:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 处理收藏/取消收藏
  const handleToggleFavorite = useCallback(() => {
    if (!currentUser || !topic) return;

    try {
      if (isFavorited) {
        removeFavorite(currentUser.id, topic.id);
      } else {
        addFavorite(currentUser.id, topic.id);
      }
      setIsFavorited(!isFavorited);
    } catch (err) {
      console.error('处理收藏失败:', err);
    }
  }, [currentUser, topic, isFavorited]);

  if (loading) {
    return <SkeletonLoader.TopicDetail />;
  }

  if (error || !topic) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-3xl font-bold mb-4">{error || '话题不存在'}</h2>
        <p className="text-gray-600 mb-4">您访问的话题可能已被删除或不存在。</p>
        <a
          href="/topics"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          返回话题列表
        </a>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md mb-8 dark:bg-gray-800 dark:text-white">
          <h2 className="text-3xl font-bold mb-2 dark:text-white">{topic.title}</h2>
          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
            <span>创建者: {topic.creator}</span>
            <span>创建时间: {formatDate(topic.createdAt)}</span>
            <span>更新时间: {formatDate(topic.updatedAt)}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {topic.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm dark:bg-gray-700 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="prose max-w-none mb-6 dark:prose-invert">
            <p>{topic.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            {/* 收藏功能 */}
            {currentUser ? (
              <button
                onClick={handleToggleFavorite}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isFavorited 
                    ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
                aria-label={isFavorited ? '取消收藏' : '收藏话题'}
              >
                <svg 
                  className="w-5 h-5" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>{isFavorited ? '已收藏' : '收藏'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <svg 
                  className="w-5 h-5" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>登录后可收藏</span>
              </div>
            )}

            {/* 分享功能 */}
            <ShareComponent 
              topicTitle={topic.title} 
              topicUrl={window.location.href} 
            />
          </div>
        </div>

        {/* 内容项列表 */}
        <ContentItemList topic={topic} />

        {/* 评论区 */}
        <CommentSection topic={topic} />
      </div>
    </ErrorBoundary>
  );
};

export default TopicDetail;
