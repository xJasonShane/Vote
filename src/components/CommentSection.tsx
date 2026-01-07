import React, { useState, useCallback } from 'react';
import { addComment, getTopic } from '../utils/dataManager';
import type { Topic, Comment, Reply } from '../types';
import { formatDate } from '../utils/helpers';

interface CommentSectionProps {
  topic: Topic;
  onTopicUpdate?: (updatedTopic: Topic) => void;
}

// 渲染回复组件
const ReplyComponent = ({ reply }: { reply: Reply }) => (
  <div className="flex items-start mt-3">
    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2 flex-shrink-0 dark:bg-gray-700">
      <span className="text-gray-600 text-xs font-medium dark:text-gray-300">
        {reply.userId.charAt(0).toUpperCase()}
      </span>
    </div>
    <div className="flex-1">
      <div className="flex items-center">
        <span className="font-medium text-sm mr-2 dark:text-white">{reply.userId}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formatDate(reply.createdAt)}
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-800 dark:text-gray-300">{reply.content}</p>
      <div className="flex items-center space-x-4 mt-1 text-xs">
        <button
          className="flex items-center text-gray-500 hover:text-blue-600 transition-colors focus:outline-none dark:text-gray-400 dark:hover:text-blue-400"
          aria-label={`点赞回复 (${reply.likes}人点赞)`}
        >
          <span className="mr-1">👍</span>
          <span>{reply.likes}</span>
        </button>
        <button
          className="text-gray-500 hover:text-blue-600 transition-colors focus:outline-none dark:text-gray-400 dark:hover:text-blue-400"
          aria-label="回复这条评论"
        >
          回复
        </button>
      </div>
    </div>
  </div>
);

// 渲染评论组件
const CommentComponent = ({ comment }: { comment: Comment }) => (
  <div key={comment.id} className="border-b border-gray-200 pb-4 dark:border-gray-700">
    <div className="flex items-start">
      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0 dark:bg-gray-700">
        <span className="text-gray-600 font-medium dark:text-gray-300">
          {comment.userId.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1">
        <div className="flex items-center">
          <span className="font-medium mr-2 dark:text-white">{comment.userId}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(comment.createdAt)}
          </span>
        </div>
        <p className="mt-1 text-gray-800 dark:text-gray-300">{comment.content}</p>
        <div className="flex items-center space-x-4 mt-2 text-sm">
          <button
            className="flex items-center text-gray-500 hover:text-blue-600 transition-colors focus:outline-none dark:text-gray-400 dark:hover:text-blue-400"
            aria-label={`点赞评论 (${comment.likes}人点赞)`}
          >
            <span className="mr-1">👍</span>
            <span>{comment.likes}</span>
          </button>
          <button
            className="text-gray-500 hover:text-blue-600 transition-colors focus:outline-none dark:text-gray-400 dark:hover:text-blue-400"
            aria-label="回复这条评论"
          >
            回复
          </button>
        </div>

        {/* 回复列表 */}
        {comment.replies.length > 0 && (
          <div className="ml-12 space-y-3">
            {comment.replies.map(reply => (
              <ReplyComponent key={reply.id} reply={reply} />
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

function CommentSection({
  topic: initialTopic,
  onTopicUpdate,
}: CommentSectionProps) {
  const [topic, setTopic] = useState<Topic>(initialTopic);
  const [commentContent, setCommentContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // 评论内容变化处理
  const handleCommentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentContent(e.target.value);
    setError(null);
    setSuccess(false);
  }, []);

  // 刷新话题数据
  const refreshTopicData = useCallback(() => {
    // 重新获取最新的话题数据
    const updatedTopic = getTopic(initialTopic.id);
    if (updatedTopic) {
      setTopic(updatedTopic);
      onTopicUpdate?.(updatedTopic);
    }
  }, [initialTopic.id, onTopicUpdate]);

  // 评论提交处理
  const handleCommentSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedContent = commentContent.trim();
    if (!trimmedContent) {
      setError('评论内容不能为空');
      return;
    }

    if (trimmedContent.length < 2) {
      setError('评论内容至少为2个字符');
      return;
    }

    if (trimmedContent.length > 500) {
      setError('评论内容不能超过500个字符');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      addComment(topic.id, trimmedContent);
      setCommentContent('');
      setSuccess(true);
      // 3秒后隐藏成功提示
      setTimeout(() => setSuccess(false), 3000);
      // 刷新数据以显示新评论
      refreshTopicData();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '评论失败，请稍后重试';
      setError(errorMessage);
      console.error('评论失败:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [commentContent, topic.id, refreshTopicData]);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md dark:bg-gray-800">
      <h3 className="text-2xl font-bold mb-6 dark:text-white">
        评论区 ({topic.comments.length} 条评论)
      </h3>

      {/* 评论表单 */}
      <form onSubmit={handleCommentSubmit} className="mb-8">
        <div className="mb-4">
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
          >
            发表评论
          </label>
          <textarea
            id="comment"
            name="comment"
            value={commentContent}
            onChange={handleCommentChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="请输入您的评论..."
            aria-describedby={error ? 'comment-error' : success ? 'comment-success' : undefined}
          ></textarea>
          <div className="mt-1 flex justify-between">
            <div className="flex space-x-2">
              {error && (
                <p id="comment-error" className="text-sm text-red-500">
                  {error}
                </p>
              )}
              {success && (
                <p id="comment-success" className="text-sm text-green-500">
                  评论发表成功！
                </p>
              )}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {commentContent.length}/500
            </span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            {isSubmitting ? '提交中...' : '发表评论'}
          </button>
        </div>
      </form>

      {/* 评论列表 */}
      {topic.comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          暂无评论，快来发表第一条评论吧！
        </div>
      ) : (
        <div className="space-y-6">
          {topic.comments.map(comment => (
            <CommentComponent key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}

export default React.memo(CommentSection);
