import React, { useState } from 'react';
import RatingComponent from './RatingComponent';
import AddContentItemForm from './AddContentItemForm';
import type { Topic, ContentItem } from '../types';
import { calculateAverageRating } from '../utils/helpers';
import { getTopic } from '../utils/dataManager';

interface ContentItemListProps {
  topic: Topic;
}

function ContentItemList({ topic: initialTopic }: ContentItemListProps) {
  const [topic, setTopic] = useState<Topic>(initialTopic);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleAddContentItem = () => {
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
  };

  const refreshTopicData = () => {
    setIsRefreshing(true);
    // 重新获取最新的话题数据
    const updatedTopic = getTopic(initialTopic.id);
    if (updatedTopic) {
      setTopic(updatedTopic);
    }
    setIsRefreshing(false);
    setShowAddForm(false);
  };

  const handleSuccess = () => {
    refreshTopicData();
  };

  const renderContentItem = (contentItem: ContentItem) => {
    // 计算该内容项的平均评分
    const itemRatings = topic.ratings.filter(
      (rating) => rating.contentItemId === contentItem.id
    );
    const averageRating = calculateAverageRating(itemRatings);

    return (
      <div
        key={contentItem.id}
        className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <div className="flex justify-between items-start mb-3">
          <h4 className="text-xl font-semibold">{contentItem.title}</h4>
          <div className="flex items-center">
            <span className="text-yellow-400 text-lg">★</span>
            <span className="ml-1 font-medium">{averageRating}</span>
            <span className="ml-1 text-sm text-gray-500">
              ({itemRatings.length}人评分)
            </span>
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">
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
          onRatingSuccess={refreshTopicData}
        />
      </div>
    );
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold">内容项列表</h3>
        <button
          onClick={handleAddContentItem}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
        <div className="mb-4 p-4 bg-yellow-100 text-yellow-700 rounded-md">
          数据更新中...
        </div>
      )}

      {topic.contentItems.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h4 className="text-xl font-semibold mb-2">暂无内容项</h4>
          <p className="text-gray-600 mb-4">添加第一个内容项开始评分吧！</p>
          <button
            onClick={handleAddContentItem}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            添加内容项
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topic.contentItems.map(renderContentItem)}
        </div>
      )}
    </div>
  );
}

export default React.memo(ContentItemList);
