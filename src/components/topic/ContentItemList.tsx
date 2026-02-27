import React, { useState, useCallback } from 'react';
import RatingComponent from './RatingComponent';
import AddContentItemForm from '../forms/AddContentItemForm';
import type { Topic, ContentItem } from '../../types';
import { calculateAverageRating } from '../../utils/helpers';
import { getTopic, updateContentItem, deleteContentItem, getCurrentUser } from '../../utils/dataManager';

interface ContentItemListProps {
  topic: Topic;
}

interface ContentItemCardProps {
  contentItem: ContentItem;
  topic: Topic;
  onRatingSuccess: () => void;
  onEdit: (contentItem: ContentItem) => void;
  onDelete: (contentItemId: string) => void;
  isOwner: boolean;
}

const ContentItemCard: React.FC<ContentItemCardProps> = ({
  contentItem,
  topic,
  onRatingSuccess,
  onEdit,
  onDelete,
  isOwner,
}) => {
  const itemRatings = topic.ratings.filter(
    (rating) => rating.contentItemId === contentItem.id
  );
  const averageRating = calculateAverageRating(itemRatings);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow dark:bg-gray-800 dark:text-white">
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-xl font-semibold">{contentItem.title}</h4>
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <span className="text-yellow-400 text-lg">★</span>
            <span className="ml-1 font-medium">{averageRating}</span>
            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
              ({itemRatings.length}人评分)
            </span>
          </div>
          {isOwner && (
            <div className="flex gap-1">
              <button
                onClick={() => onEdit(contentItem)}
                className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                aria-label="编辑内容项"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(contentItem.id)}
                className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                aria-label="删除内容项"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2 dark:text-gray-300">
        {contentItem.description}
      </p>

      {contentItem.imageUrl && (
        <div className="mb-4 rounded overflow-hidden">
          <img
            src={contentItem.imageUrl}
            alt={contentItem.title}
            className="w-full h-48 object-cover transition-transform hover:scale-105 hover:duration-300"
            loading="lazy"
          />
        </div>
      )}

      <RatingComponent
        topic={topic}
        contentItem={contentItem}
        onRatingSuccess={onRatingSuccess}
      />
    </div>
  );
};

function ContentItemList({ topic: initialTopic }: ContentItemListProps) {
  const [topic, setTopic] = useState<Topic>(initialTopic);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUser = getCurrentUser();
  const isOwner = currentUser && topic.creator === currentUser.username;

  const refreshTopicData = useCallback(() => {
    setIsRefreshing(true);
    const updatedTopic = getTopic(initialTopic.id);
    if (updatedTopic) {
      setTopic(updatedTopic);
    }
    setIsRefreshing(false);
    setShowAddForm(false);
  }, [initialTopic.id]);

  const handleAddContentItem = useCallback(() => {
    setShowAddForm(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setShowAddForm(false);
  }, []);

  const handleSuccess = useCallback(() => {
    refreshTopicData();
  }, [refreshTopicData]);

  const handleEditClick = useCallback((contentItem: ContentItem) => {
    setEditingItem(contentItem);
    setEditFormData({
      title: contentItem.title,
      description: contentItem.description,
      imageUrl: contentItem.imageUrl || '',
    });
  }, []);

  const handleEditChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleEditSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const trimmedTitle = editFormData.title.trim();
    if (!trimmedTitle) {
      alert('标题不能为空');
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedItem = updateContentItem(topic.id, editingItem.id, {
        title: trimmedTitle,
        description: editFormData.description.trim(),
        imageUrl: editFormData.imageUrl.trim() || undefined,
      });

      if (updatedItem) {
        setEditingItem(null);
        refreshTopicData();
      }
    } catch (err) {
      console.error('更新内容项失败:', err);
      alert('更新内容项失败');
    } finally {
      setIsSubmitting(false);
    }
  }, [editingItem, editFormData, topic.id, refreshTopicData]);

  const handleDeleteClick = useCallback((contentItemId: string) => {
    setDeleteConfirmId(contentItemId);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteConfirmId) return;

    try {
      const success = deleteContentItem(topic.id, deleteConfirmId);
      if (success) {
        refreshTopicData();
      }
    } catch (err) {
      console.error('删除内容项失败:', err);
      alert('删除内容项失败');
    } finally {
      setDeleteConfirmId(null);
    }
  }, [deleteConfirmId, topic.id, refreshTopicData]);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold dark:text-white">内容项列表</h3>
        <button
          onClick={handleAddContentItem}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-800"
          aria-label="添加内容项"
        >
          添加内容项
        </button>
      </div>

      {showAddForm && (
        <AddContentItemForm
          topic={topic}
          onClose={handleCloseForm}
          onSuccess={handleSuccess}
        />
      )}

      {isRefreshing && (
        <div className="mb-4 p-4 bg-yellow-100 text-yellow-700 rounded-md dark:bg-yellow-900 dark:text-yellow-300">
          数据更新中...
        </div>
      )}

      {topic.contentItems.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center dark:bg-gray-800 dark:text-white">
          <h4 className="text-xl font-semibold mb-2">暂无内容项</h4>
          <p className="text-gray-600 mb-4 dark:text-gray-300">添加第一个内容项开始评分吧！</p>
          <button
            onClick={handleAddContentItem}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            添加内容项
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topic.contentItems.map((contentItem) => (
            <ContentItemCard
              key={contentItem.id}
              contentItem={contentItem}
              topic={topic}
              onRatingSuccess={refreshTopicData}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              isOwner={!!isOwner}
            />
          ))}
        </div>
      )}

      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-lg w-full mx-4">
            <h3 className="text-xl font-bold mb-4 dark:text-white">编辑内容项</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label htmlFor="edit-item-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  标题 *
                </label>
                <input
                  type="text"
                  id="edit-item-title"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-item-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  描述
                </label>
                <textarea
                  id="edit-item-description"
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="edit-item-imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  图片URL
                </label>
                <input
                  type="url"
                  id="edit-item-imageUrl"
                  name="imageUrl"
                  value={editFormData.imageUrl}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
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
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4 dark:text-white">确认删除</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              确定要删除这个内容项吗？此操作不可撤销，所有相关的评分都将被删除。
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
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
  );
}

export default React.memo(ContentItemList);
