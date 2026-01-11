import React, { useState, useCallback } from 'react';
import { addRating } from '../utils/dataManager';
import type { ContentItem, Topic } from '../types';
import RatingStatsComponent from './RatingStatsComponent';

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

  const handleRatingChange = useCallback((newScore: number) => {
    setScore(newScore);
    setError(null);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
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
      const errorMessage = err instanceof Error ? err.message : '评分失败，请稍后重试';
      setError(errorMessage);
      console.error('评分失败:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [topic.id, contentItem.id, score, onRatingSuccess]);

  return (
    <div className="space-y-6">
      {/* 评分统计 */}
      <RatingStatsComponent topic={topic} contentItem={contentItem} />
      
      {/* 评分表单 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <h3 
          id="rating-title"
          className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4"
        >
          为「{contentItem.title}」评分
        </h3>

        {showSuccess && (
          <div 
            className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-3 rounded-lg mb-4"
            role="status"
            aria-live="polite"
          >
            评分成功！
          </div>
        )}

        {error && (
          <div 
            id="rating-error"
            className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-lg mb-4"
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        )}

        <form 
          onSubmit={handleSubmit} 
          className="space-y-4"
          aria-labelledby="rating-title"
          aria-describedby={error ? 'rating-error' : undefined}
        >
          <div className="flex items-center space-x-2">
            <label 
              htmlFor="rating" 
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
              aria-label="评分"
            >
              评分：
            </label>
            <div className="flex" role="radiogroup" aria-label={`为 ${contentItem.title} 评分`} aria-required="true">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleRatingChange(star);
                    }
                  }}
                  className={`text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full transition-all duration-200 hover:scale-110 ${star <= score ? 'text-yellow-400' : 'text-gray-300'}`}
                  aria-label={`${star} 星`}
                  aria-checked={star <= score}
                  aria-describedby="rating-description"
                >
                  ★
                </button>
              ))}
            </div>
            <span 
              id="rating-description"
              className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {score} 星
            </span>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              aria-label="提交评分"
              aria-busy={isSubmitting}
            >
              {isSubmitting ? '评分中...' : '提交评分'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default React.memo(RatingComponent);
