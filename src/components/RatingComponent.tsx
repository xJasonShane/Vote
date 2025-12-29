import React, { useState } from 'react';
import { addRating } from '../utils/dataManager';
import type { ContentItem, Topic } from '../types';

interface RatingComponentProps {
  topic: Topic;
  contentItem: ContentItem;
  onRatingSuccess?: () => void;
}

function RatingComponent({
  topic,
  contentItem,
  onRatingSuccess,
}: RatingComponentProps) {
  const [score, setScore] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleRatingChange = (newScore: number) => {
    setScore(newScore);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (score === 0) {
      setError('请先选择评分');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      addRating(topic.id, contentItem.id, score);
      setShowSuccess(true);
      // 调用评分成功回调
      onRatingSuccess?.();
      // 3秒后隐藏成功提示
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '评分失败，请稍后重试';
      setError(errorMessage);
      console.error('评分失败:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">
        为「{contentItem.title}」评分
      </h3>

      {showSuccess && (
        <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4">
          评分成功！
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="rating" className="text-sm font-medium text-gray-700">
            评分：
          </label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className={`text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full ${star <= score ? 'text-yellow-400' : 'text-gray-300'}`}
                aria-label={`给 ${contentItem.title} 打 ${star} 星`}
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
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isSubmitting ? '评分中...' : '提交评分'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default React.memo(RatingComponent);
