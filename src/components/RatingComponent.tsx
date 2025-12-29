import React, { useState } from 'react';
import { addRating } from '../utils/dataManager';
import type { ContentItem, Topic } from '../types';

interface RatingComponentProps {
  topic: Topic;
  contentItem: ContentItem;
}

const RatingComponent: React.FC<RatingComponentProps> = ({ topic, contentItem }) => {
  const [score, setScore] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRatingChange = (newScore: number) => {
    setScore(newScore);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (score === 0) {
      alert('请先选择评分');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      addRating(topic.id, contentItem.id, score);
      setShowSuccess(true);
      // 3秒后隐藏成功提示
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('评分失败:', error);
      alert('评分失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">为「{contentItem.title}」评分</h3>
      
      {showSuccess && (
        <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4">
          评分成功！
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">评分：</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className={`text-2xl focus:outline-none ${star <= score ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </button>
            ))}
          </div>
          <span className="ml-2 text-sm font-medium">{score} 星</span>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '评分中...' : '提交评分'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RatingComponent;