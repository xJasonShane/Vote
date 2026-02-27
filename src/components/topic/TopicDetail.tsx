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
      <div className="glass-card p-12 text-center animate-fade-in">
        <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-slate-800 dark:text-slate-100">{error || '话题不存在'}</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">您访问的话题可能已被删除或不存在。</p>
        <a
          href="/topics"
          className="btn btn-primary"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回话题列表
        </a>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="max-w-6xl mx-auto">
        <div className="glass-card p-8 mb-8 animate-fade-in">
          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div>
                <label htmlFor="edit-title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  话题标题 *
                </label>
                <input
                  type="text"
                  id="edit-title"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  话题描述 *
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  rows={4}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-tags" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  标签（用逗号分隔）
                </label>
                <input
                  type="text"
                  id="edit-tags"
                  name="tags"
                  value={editFormData.tags}
                  onChange={handleEditChange}
                  className="input-field"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-ghost"
                  disabled={isSubmitting}
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                >
                  {isSubmitting ? '保存中...' : '保存'}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-4xl font-bold gradient-text">{topic.title}</h2>
                {isOwner && (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleEditClick}
                      className="btn btn-ghost text-sm px-4 py-2"
                      aria-label="编辑话题"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      编辑
                    </button>
                    <button
                      onClick={handleDeleteClick}
                      className="btn btn-danger text-sm px-4 py-2"
                      aria-label="删除话题"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      删除
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {topic.creator}
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  创建: {formatDate(topic.createdAt)}
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  更新: {formatDate(topic.updatedAt)}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {topic.tags.map((tag) => (
                  <span
                    key={tag}
                    className="tag"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="prose prose-lg max-w-none mb-8 text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>{topic.description}</p>
              </div>
            </>
          )}

          {!isEditing && (
            <div className="flex flex-wrap items-center gap-4">
              {currentUser ? (
                <button
                  onClick={handleToggleFavorite}
                  className={`btn ${isFavorited ? 'btn-danger' : 'btn-ghost border border-slate-200 dark:border-slate-700'}`}
                  aria-label={isFavorited ? '取消收藏' : '收藏话题'}
                >
                  <svg 
                    className="w-5 h-5" 
                    fill={isFavorited ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{isFavorited ? '已收藏' : '收藏'}</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg">
                  <svg 
                    className="w-5 h-5" 
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="glass-card p-8 max-w-md w-full mx-4 animate-scale-in">
              <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center text-slate-800 dark:text-slate-100">确认删除</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 text-center">
                确定要删除话题「{topic.title}」吗？此操作不可撤销，所有相关的内容项、评分和评论都将被删除。
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn btn-ghost"
                >
                  取消
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="btn btn-danger"
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
