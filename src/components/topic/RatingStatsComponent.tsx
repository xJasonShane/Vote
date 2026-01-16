import { useCallback, useMemo } from 'react';
import type { ContentItem, Topic } from '../../types';

interface RatingStatsComponentProps {
  topic: Topic;
  contentItem: ContentItem;
}

interface RatingStats {
  averageScore: number;
  totalRatings: number;
  distribution: { [key: number]: number };
}

export default function RatingStatsComponent({ topic, contentItem }: RatingStatsComponentProps) {
  // 计算评分统计数据
  const calculateRatingStats = useCallback((topic: Topic, contentItem: ContentItem): RatingStats => {
    // 获取该内容项的所有评分
    const contentRatings = topic.ratings.filter(
      (rating) => rating.contentItemId === contentItem.id
    );

    const totalRatings = contentRatings.length;
    
    // 计算平均评分
    const totalScore = contentRatings.reduce((sum, rating) => sum + rating.score, 0);
    const averageScore = totalRatings > 0 ? totalScore / totalRatings : 0;

    // 计算评分分布
    const distribution: { [key: number]: number } = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    contentRatings.forEach((rating) => {
      distribution[rating.score] = (distribution[rating.score] || 0) + 1;
    });

    return {
      averageScore,
      totalRatings,
      distribution,
    };
  }, []);

  const stats = useMemo(() => calculateRatingStats(topic, contentItem), [topic, contentItem, calculateRatingStats]);

  // 生成评分分布的百分比
  const calculatePercentage = (count: number) => {
    if (stats.totalRatings === 0) return 0;
    return Math.round((count / stats.totalRatings) * 100);
  };

  // 生成星级评分显示
  const renderStars = (score: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`text-lg ${index < Math.round(score) ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 mb-6">
      <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
        评分统计
      </h3>

      {stats.totalRatings === 0 ? (
        <div className="text-center py-8">
          <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-2xl">📊</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400">暂无评分数据</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 平均评分 */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {renderStars(stats.averageScore)}
            </div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.averageScore.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              基于 {stats.totalRatings} 条评分
            </div>
          </div>

          {/* 评分分布 */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              评分分布
            </h4>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats.distribution[star] || 0;
                const percentage = calculatePercentage(count);
                
                return (
                  <div key={star} className="flex items-center gap-4">
                    <div className="flex items-center w-12">
                      <span className="text-lg text-yellow-400">★</span>
                      <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {star} 星
                      </span>
                    </div>
                    
                    {/* 评分分布条 */}
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    
                    {/* 评分数量和百分比 */}
                    <div className="flex items-center gap-2 w-24 text-right">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {count}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({percentage}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 评分趋势（简单实现） */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              评分趋势
            </h4>
            <div className="relative h-40 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              {/* 简单的趋势图实现 */}
              <div className="flex items-end justify-between h-full gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                  // 这里可以根据实际需求实现更复杂的趋势图
                  const height = Math.random() * 60 + 20; // 模拟数据
                  
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-blue-700 rounded-t-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-800"
                        style={{ height: `${height}%` }}
                      ></div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {day}日
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
