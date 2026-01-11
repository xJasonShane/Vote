import React, { useState, useCallback } from 'react';
import { createTopic } from '../utils/dataManager';

interface FormData {
  title: string;
  description: string;
  creator: string;
  tags: string;
}

function CreateTopicForm() {
  // 从 localStorage 获取当前用户
  const getCurrentUser = () => {
    if (typeof window === 'undefined') return null;
    
    const savedUser = localStorage.getItem('vote_rating_current_user');
    return savedUser ? JSON.parse(savedUser) : null;
  };
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    creator: '',
    tags: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // 清除对应字段的错误
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name as keyof FormData];
      return newErrors;
    });
    setGeneralError(null);
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<FormData> = {};
    const currentUser = getCurrentUser();

    if (!formData.title.trim()) {
      newErrors.title = '标题不能为空';
    }

    if (!formData.description.trim()) {
      newErrors.description = '描述不能为空';
    }

    if (!currentUser) {
      setGeneralError('请先登录再创建话题');
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setGeneralError(null);

    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        throw new Error('请先登录再创建话题');
      }
      
      // 处理标签，将字符串转换为数组
      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag !== '');

      // 创建话题
      createTopic({
        title: formData.title,
        description: formData.description,
        creator: currentUser.username,
        tags: tagsArray,
      });

      // 跳转到话题列表页面
      window.location.href = '/topics';
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '创建话题失败，请稍后重试';
      setGeneralError(errorMessage);
      console.error('创建话题失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm]);

  const currentUser = getCurrentUser();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {generalError && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {generalError}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          话题标题 *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="请输入话题标题"
          required
          aria-required="true"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && (
          <p id="title-error" className="mt-1 text-sm text-red-500">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          话题描述 *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="请输入话题描述"
          required
          aria-required="true"
          aria-invalid={!!errors.description}
          aria-describedby={
            errors.description ? 'description-error' : undefined
          }
        />
        {errors.description && (
          <p id="description-error" className="mt-1 text-sm text-red-500">
            {errors.description}
          </p>
        )}
      </div>

      {currentUser && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            当前用户：<span className="font-medium">{currentUser.username}</span>
          </p>
        </div>
      )}

      <div>
        <label
          htmlFor="tags"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          标签（用逗号分隔，可选）
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="例如：电影,科幻,评分"
          aria-describedby="tags-hint"
        />
        <p id="tags-hint" className="mt-1 text-xs text-gray-500">
          多个标签之间用逗号分隔
        </p>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
        <a
          href="/topics"
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          aria-label="取消创建话题"
        >
          取消
        </a>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="创建话题"
        >
          {isSubmitting ? '创建中...' : '创建话题'}
        </button>
      </div>
    </form>
  );
}

export default React.memo(CreateTopicForm);
