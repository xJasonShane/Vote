import React, { useEffect, useState } from 'react';
import { getTopic } from '../utils/dataManager';
import { formatDate } from '../utils/helpers';
import ContentItemList from './ContentItemList';
import CommentSection from './CommentSection';
import ShareComponent from './ShareComponent';
// ErrorBoundary 组件暂未实现，先留空占位
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => <>{children}</>;
import type { Topic } from '../types';

const TopicDetail: React.FC = () => {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 从URL参数中获取话题ID
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-medium">加载中...</div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-3xl font-bold mb-4">{error || '话题不存在'}</h2>
        <p className="text-gray-600 mb-4">您访问的话题可能已被删除或不存在。</p>
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
          <h2 className="text-3xl font-bold mb-2 dark:text-white">{topic.title}</h2>
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

          {/* 分享功能 */}
          <ShareComponent 
            topicTitle={topic.title} 
            topicUrl={window.location.href} 
          />
        </div>

        {/* 内容项列表 */}
        <ContentItemList topic={topic} />

        {/* 评论区 */}
        <CommentSection topic={topic} />
      </div>
    </ErrorBoundary>
  );
};

export default TopicDetail;
