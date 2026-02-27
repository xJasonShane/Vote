import React, { useState, useCallback, useMemo } from 'react';
import { addComment, getTopic, addReply, likeComment, likeReply } from '../../utils/dataManager';
import type { Topic, Comment, Reply } from '../../types';
import { formatDate } from '../../utils/helpers';

interface CommentSectionProps {
  topic: Topic;
  onTopicUpdate?: (updatedTopic: Topic) => void;
}

// 获取当前用户信息
const getCurrentUser = () => {
  if (typeof window === 'undefined') return 'Anonymous';
  const savedUser = localStorage.getItem('vote_rating_current_user');
  const user = savedUser ? JSON.parse(savedUser) : null;
  return user?.username || 'Anonymous';
};

// 回复组件
const ReplyComponent = ({ 
  reply, 
  commentId, 
  onReplyAdded, 
  onReplyLiked 
}: { 
  reply: Reply; 
  commentId: string; 
  onReplyAdded: () => void; 
  onReplyLiked: (replyId: string) => void;
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  
  const handleReplySubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedContent = replyContent.trim();
    if (!trimmedContent) return;
    
    try {
      addReply(commentId, trimmedContent);
      setReplyContent('');
      setIsReplying(false);
      setReplyingTo(null);
      onReplyAdded();
    } catch (error) {
      console.error('回复失败:', error);
    }
  }, [commentId, replyContent, onReplyAdded]);
  
  const handleLike = useCallback(() => {
    try {
      likeReply(reply.id);
      onReplyLiked(reply.id);
    } catch (error) {
      console.error('点赞失败:', error);
    }
  }, [reply.id, onReplyLiked]);
  
  return (
    <div className="flex items-start mt-4">
      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
        <span className="text-white text-xs font-medium">
          {reply.userId.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
        <div className="flex items-center">
          <span className="font-medium text-sm mr-2 dark:text-white">{reply.userId}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(reply.createdAt)}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-800 dark:text-gray-300">{reply.content}</p>
        <div className="flex items-center space-x-4 mt-2 text-xs">
          <button
            onClick={handleLike}
            className="flex items-center text-gray-500 hover:text-blue-600 transition-all duration-200 focus:outline-none transform hover:scale-105 dark:text-gray-400 dark:hover:text-blue-400"
            aria-label={`点赞回复 (${reply.likes}人点赞)`}
          >
            <span className="mr-1">👍</span>
            <span>{reply.likes}</span>
          </button>
          <button
            onClick={() => {
              setIsReplying(true);
              setReplyingTo(reply.userId);
            }}
            className="text-gray-500 hover:text-blue-600 transition-all duration-200 focus:outline-none transform hover:scale-105 dark:text-gray-400 dark:hover:text-blue-400"
            aria-label="回复这条评论"
          >
            回复
          </button>
        </div>
        
        {/* 回复表单 */}
        {isReplying && replyingTo === reply.userId && (
          <form onSubmit={handleReplySubmit} className="mt-3">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={2}
              placeholder={`回复 @${reply.userId}...`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            ></textarea>
            <div className="flex justify-end space-x-2 mt-1">
              <button
                type="button"
                onClick={() => {
                  setIsReplying(false);
                  setReplyingTo(null);
                  setReplyContent('');
                }}
                className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700 transition-colors focus:outline-none dark:text-gray-400 dark:hover:text-gray-300"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                回复
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// 评论组件
const CommentComponent = ({ 
  comment, 
  onCommentLiked, 
  onReplyAdded 
}: { 
  comment: Comment; 
  onCommentLiked: (commentId: string) => void;
  onReplyAdded: () => void;
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  
  // 计算点赞数和回复数
  const stats = useMemo(() => {
    return {
      totalLikes: comment.likes,
      totalReplies: comment.replies.length
    };
  }, [comment.likes, comment.replies.length]);
  
  // 处理评论点赞
  const handleCommentLike = useCallback(() => {
    try {
      likeComment(comment.id);
      onCommentLiked(comment.id);
    } catch (error) {
      console.error('点赞失败:', error);
    }
  }, [comment.id, onCommentLiked]);
  
  // 处理回复提交
  const handleReplySubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedContent = replyContent.trim();
    if (!trimmedContent) return;
    
    try {
      addReply(comment.id, '', trimmedContent);
      setReplyContent('');
      setIsReplying(false);
      onReplyAdded();
    } catch (error) {
      console.error('回复失败:', error);
    }
  }, [comment.id, replyContent, onReplyAdded]);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-lg">
      <div className="flex items-start">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
          <span className="text-white font-medium">
            {comment.userId.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="font-semibold dark:text-white">{comment.userId}</span>
              <span className="text-sm text-gray-500 ml-2 dark:text-gray-400">
                {formatDate(comment.createdAt)}
              </span>
            </div>
            {stats.totalReplies > 3 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors focus:outline-none dark:text-blue-400 dark:hover:text-blue-300"
              >
                {isExpanded ? `收起 ${stats.totalReplies} 条回复` : `展开 ${stats.totalReplies} 条回复`}
              </button>
            )}
          </div>
          <p className="mt-2 text-gray-800 dark:text-gray-300">{comment.content}</p>
          
          <div className="flex items-center space-x-6 mt-3 text-sm">
            <button
              onClick={handleCommentLike}
              className="flex items-center text-gray-500 hover:text-blue-600 transition-all duration-200 focus:outline-none transform hover:scale-105 dark:text-gray-400 dark:hover:text-blue-400"
              aria-label={`点赞评论 (${stats.totalLikes}人点赞)`}
            >
              <span className="mr-1">👍</span>
              <span>{stats.totalLikes}</span>
            </button>
            <button
              onClick={() => setIsReplying(true)}
              className="flex items-center text-gray-500 hover:text-blue-600 transition-all duration-200 focus:outline-none transform hover:scale-105 dark:text-gray-400 dark:hover:text-blue-400"
              aria-label="回复这条评论"
            >
              <span className="mr-1">💬</span>
              <span>{stats.totalReplies}</span>
            </button>
          </div>
          
          {/* 回复表单 */}
          {isReplying && (
            <form onSubmit={handleReplySubmit} className="mt-4">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={2}
                placeholder="回复..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              ></textarea>
              <div className="flex justify-end space-x-3 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsReplying(false);
                    setReplyContent('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none shadow-md hover:shadow-lg transform hover:-translate-y-0.5 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  回复
                </button>
              </div>
            </form>
          )}
          
          {/* 回复列表 */}
          {comment.replies.length > 0 && (
            <div className="ml-4 mt-4 border-l-2 border-gray-200 pl-4 dark:border-gray-700">
              {(isExpanded ? comment.replies : comment.replies.slice(0, 3)).map(reply => (
                <ReplyComponent 
                  key={reply.id} 
                  reply={reply} 
                  commentId={comment.id}
                  onReplyAdded={onReplyAdded}
                  onReplyLiked={() => onReplyAdded()}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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
      const currentUser = getCurrentUser();
      addComment(topic.id, trimmedContent, currentUser);
      setCommentContent('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      refreshTopicData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '评论失败，请稍后重试';
      setError(errorMessage);
      console.error('评论失败:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [commentContent, topic.id, refreshTopicData]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-6">
        评论区 ({topic.comments.length} 条评论)
      </h3>

      {/* 评论表单 */}
      <form onSubmit={handleCommentSubmit} className="mb-8">
        <div className="mb-4">
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300"
          >
            发表评论
          </label>
          <textarea
            id="comment"
            name="comment"
            value={commentContent}
            onChange={handleCommentChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="分享你的观点和想法..."
            aria-describedby={error ? 'comment-error' : success ? 'comment-success' : undefined}
          ></textarea>
          <div className="mt-2 flex justify-between items-center">
            <div>
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
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {commentContent.length}/500
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                {isSubmitting ? '提交中...' : '发表评论'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* 评论列表 */}
      {topic.comments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-blue-600 dark:text-blue-400 text-2xl">💬</span>
          </div>
          <h4 className="text-lg font-semibold mb-2 dark:text-white">暂无评论</h4>
          <p className="text-gray-500 dark:text-gray-400">
            快来发表第一条评论，开启讨论吧！
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {topic.comments.map(comment => (
            <CommentComponent 
              key={comment.id} 
              comment={comment} 
              onCommentLiked={refreshTopicData}
              onReplyAdded={refreshTopicData}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default React.memo(CommentSection);
