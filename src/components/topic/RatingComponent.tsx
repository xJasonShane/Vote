import React, { useState, useCallback, useEffect } from 'react';
import { addRating, getCurrentUserRating } from '../../utils/dataManager';
import { getCurrentUser } from '../../utils/managers/userManager';
import type { ContentItem, Topic, Rating } from '../../types';
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
  const [hoveredScore, setHoveredScore] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [existingRating, setExistingRating] = useState<Rating | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    setIsLoggedIn(!!user);
    
    if (user) {
      const rating = getCurrentUserRating(topic.id, contentItem.id);
      if (rating) {
        setExistingRating(rating);
        setScore(rating.score);
      }
    }
  }, [topic.id, contentItem.id]);

  const handleRatingChange = useCallback((newScore: number) => {
    if (!isLoggedIn) {
      setError('请先登录后再评分');
      return;
    }
    setScore(newScore);
    setError(null);
  }, [isLoggedIn]);

  const handleMouseEnter = useCallback((starScore: number) => {
    if (isLoggedIn) {
      setHoveredScore(starScore);
    }
  }, [isLoggedIn]);

  const handleMouseLeave = useCallback(() => {
    setHoveredScore(0);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isLoggedIn) {
      setError('请先登录后再评分');
      return;
    }

    if (score === 0) {
      setError('请先选择评分');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = addRating(topic.id, contentItem.id, score);
      setExistingRating(result);
      setShowSuccess(true);
      onRatingSuccess?.();
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
  }, [topic.id, contentItem.id, score, onRatingSuccess, isLoggedIn]);

  const displayScore = hoveredScore || score;

  return (
    <div className="space-y-6">
      <RatingStatsComponent topic={topic} contentItem={contentItem} />
      
      <div className="glass-card p-8 animate-fade-in">
        <h3 
          id="rating-title"
          className="text-2xl font-bold gradient-text mb-6"
        >
          为「{contentItem.title}」评分
        </h3>

        {!isLoggedIn && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400 p-4 rounded-xl mb-6 flex items-start gap-3">
            <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-medium">请先登录后再评分</p>
              <a href="/" className="text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block text-sm">
                点击此处登录 →
              </a>
            </div>
          </div>
        )}

        {showSuccess && (
          <div 
            className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 p-4 rounded-xl mb-6 flex items-center gap-3 animate-fade-in"
            role="status"
            aria-live="polite"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{existingRating ? '评分已更新！' : '评分成功！'}</span>
          </div>
        )}

        {error && (
          <div 
            id="rating-error"
            className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-400 p-4 rounded-xl mb-6 flex items-center gap-3"
            role="alert"
            aria-live="polite"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {existingRating && !showSuccess && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-400 p-4 rounded-xl mb-6 flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>您已评过此内容项，当前评分：{existingRating.score} 星</span>
          </div>
        )}

        <form 
          onSubmit={handleSubmit} 
          className="space-y-6"
          aria-labelledby="rating-title"
          aria-describedby={error ? 'rating-error' : undefined}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <label 
              htmlFor="rating" 
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
              aria-label="评分"
            >
              选择评分：
            </label>
            <div 
              className="flex items-center gap-2" 
              role="radiogroup" 
              aria-label={`为 ${contentItem.title} 评分`} 
              aria-required="true"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  onMouseEnter={() => handleMouseEnter(star)}
                  onMouseLeave={handleMouseLeave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleRatingChange(star);
                    }
                  }}
                  className={`text-4xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg transition-all duration-200 ${
                    star <= displayScore 
                      ? 'text-amber-400 drop-shadow-lg scale-110' 
                      : 'text-slate-300 dark:text-slate-600 hover:text-amber-300'
                  } ${!isLoggedIn ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:scale-125'}`}
                  aria-label={`${star} 星`}
                  aria-checked={star === score}
                  aria-describedby="rating-description"
                  disabled={!isLoggedIn}
                >
                  ★
                </button>
              ))}
            </div>
            <span 
              id="rating-description"
              className="text-lg font-semibold text-slate-700 dark:text-slate-300 min-w-[60px]"
            >
              {displayScore || score} 星
            </span>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !isLoggedIn}
              className="btn btn-primary"
              aria-label="提交评分"
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  评分中...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {existingRating ? '更新评分' : '提交评分'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default React.memo(RatingComponent);
