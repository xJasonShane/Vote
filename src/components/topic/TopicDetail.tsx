import React, { useEffect, useState, useCallback } from 'react';
import { getTopic, getCurrentUser, addFavorite, removeFavorite, isTopicFavorited, deleteTopic, updateTopic } from '../../utils/dataManager';
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
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    tags: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    if (topic && currentUser) {
      const favorited = isTopicFavorited(currentUser.id, topic.id);
      setIsFavorited(favorited);
    }
  }, [topic, currentUser]);

  useEffect(() => {
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
        setEditFormData({
          title: topicData.title,
          description: topicData.description,
          tags: topicData.tags.join(', '),
        });
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

  const handleEditClick = useCallback(() => {
    if (topic) {
      setEditFormData({
        title: topic.title,
        description: topic.description,
        tags: topic.tags.join(', '),
      });
      setIsEditing(true);
    }
  }, [topic]);

  const handleEditChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleEditSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    const trimmedTitle = editFormData.title.trim();
    const trimmedDescription = editFormData.description.trim();
    
    if (!trimmedTitle) {
      alert('标题不能为空');
      return;
    }

    if (!trimmedDescription) {
      alert('描述不能为空');
      return;
    }

    setIsSubmitting(true);

    try {
      const tagsArray = editFormData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');

      const updatedTopic = updateTopic(topic.id, {
        title: trimmedTitle,
        description: trimmedDescription,
        tags: tagsArray,
      });

      if (updatedTopic) {
        setTopic(updatedTopic);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('更新话题失败:', err);
      alert('更新话题失败');
    } finally {
      setIsSubmitting(false);
    }
  }, [topic, editFormData]);

  const handleDeleteClick = useCallback(() => {
    setShowDeleteConfirm(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (!topic) return;

    try {
      const success = deleteTopic(topic.id);
      if (success) {
        window.location.href = '/topics';
      } else {
        alert('删除话题失败');
      }
    } catch (err) {
      console.error('删除话题失败:', err);
      alert('删除话题失败');
    }
  }, [topic]);

  const isOwner = currentUser && topic && topic.creator === currentUser.username;

  if (loading) {
    return <SkeletonLoader.TopicDetail />;
  }

  if (error || !topic) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center dark:bg-gray-800">
        <h2 className="text-3xl font-bold mb-4 dark:text-white">{error || '话题不存在'}</h2>
        <p className="text-gray-600 mb-4 dark:text-gray-400">您访问的话题可能已被删除或不存在。</p>
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
          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  话题标题 *
                </label>
                <input
                  type="text"
                  id="edit-title"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  话题描述 *
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  标签（用逗号分隔）
                </label>
                <input
                  type="text"
                  id="edit-tags"
                  name="tags"
                  value={editFormData.tags}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
                  disabled={isSubmitting}
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {isSubmitting ? '保存中...' : '保存'}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-3xl font-bold dark:text-white">{topic.title}</h2>
                {isOwner && (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleEditClick}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      aria-label="编辑话题"
                    >
                      编辑
                    </button>
                    <button
                      onClick={handleDeleteClick}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                      aria-label="删除话题"
                    >
                      删除
                    </button>
                  </div>
                )}
              </div>

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
            </>
          )}

          {!isEditing && (
            <div className="flex flex-wrap items-center gap-4 mb-6">
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

              <ShareComponent 
                topicTitle={topic.title} 
                topicUrl={window.location.href} 
              />
            </div>
          )}
        </div>

        <ContentItemList topic={topic} />

        <CommentSection topic={topic} />

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4 dark:text-white">确认删除</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                确定要删除话题「{topic.title}」吗？此操作不可撤销，所有相关的内容项、评分和评论都将被删除。
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
                >
                  取消
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default TopicDetail;
