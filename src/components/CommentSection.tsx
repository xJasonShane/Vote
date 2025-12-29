import React, { useState } from 'react';
import { addComment } from '../utils/dataManager';
import type { Topic } from '../types';
import { formatDate } from '../utils/helpers';

interface CommentSectionProps {
  topic: Topic;
}

const CommentSection: React.FC<CommentSectionProps> = ({ topic }) => {
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentContent(e.target.value);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentContent.trim()) {
      alert('评论内容不能为空');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      addComment(topic.id, commentContent);
      setCommentContent('');
      // 刷新页面以显示新评论
      window.location.reload();
    } catch (error) {
      console.error('评论失败:', error);
      alert('评论失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-6">评论区 ({topic.comments.length} 条评论)</h3>
      
      {/* 评论表单 */}
      <form onSubmit={handleCommentSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            发表评论
          </label>
          <textarea
            id="comment"
            name="comment"
            value={commentContent}
            onChange={handleCommentChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入您的评论..."
          ></textarea>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '提交中...' : '发表评论'}
          </button>
        </div>
      </form>
      
      {/* 评论列表 */}
      {topic.comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          暂无评论，快来发表第一条评论吧！
        </div>
      ) : (
        <div className="space-y-6">
          {topic.comments.map(comment => (
            <div key={comment.id} className="border-b border-gray-200 pb-4">
              <div className="flex items-start mb-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <span className="text-gray-600 font-medium">{comment.userId.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">{comment.userId}</span>
                    <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="mt-1 text-gray-800">{comment.content}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mt-2 text-sm">
                <button className="flex items-center text-gray-500 hover:text-blue-600 transition-colors">
                  <span className="mr-1">👍</span>
                  <span>{comment.likes}</span>
                </button>
                <button className="text-gray-500 hover:text-blue-600 transition-colors">
                  回复
                </button>
              </div>
              
              {/* 回复列表 */}
              {comment.replies.length > 0 && (
                <div className="ml-12 mt-3 space-y-4">
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="flex items-start">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                        <span className="text-gray-600 text-xs font-medium">{reply.userId.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="font-medium text-sm mr-2">{reply.userId}</span>
                          <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-800">{reply.content}</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs">
                          <button className="flex items-center text-gray-500 hover:text-blue-600 transition-colors">
                            <span className="mr-1">👍</span>
                            <span>{reply.likes}</span>
                          </button>
                          <button className="text-gray-500 hover:text-blue-600 transition-colors">
                            回复
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;