import React, { useState } from 'react';
import RatingComponent from './RatingComponent';
import AddContentItemForm from './AddContentItemForm';
import type { Topic } from '../types';
import { calculateAverageRating } from '../utils/helpers';

interface ContentItemListProps {
  topic: Topic;
}

const ContentItemList: React.FC<ContentItemListProps> = ({ topic }) => {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddContentItem = () => {
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
  };

  const handleSuccess = () => {
    // 刷新页面以显示新添加的内容项
    window.location.reload();
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold">内容项列表</h3>
        <button 
          onClick={handleAddContentItem}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
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
      
      {topic.contentItems.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h4 className="text-xl font-semibold mb-2">暂无内容项</h4>
          <p className="text-gray-600 mb-4">添加第一个内容项开始评分吧！</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topic.contentItems.map((contentItem) => {
            // 计算该内容项的平均评分
            const itemRatings = topic.ratings.filter(rating => rating.contentItemId === contentItem.id);
            const averageRating = calculateAverageRating(itemRatings);
            
            return (
              <div key={contentItem.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-xl font-semibold">{contentItem.title}</h4>
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-lg">★</span>
                    <span className="ml-1 font-medium">{averageRating}</span>
                    <span className="ml-1 text-sm text-gray-500">({itemRatings.length}人评分)</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{contentItem.description}</p>
                
                {contentItem.imageUrl && (
                  <div className="mb-4">
                    <img 
                      src={contentItem.imageUrl} 
                      alt={contentItem.title} 
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>
                )}
                
                <RatingComponent topic={topic} contentItem={contentItem} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ContentItemList;