import React, { useState } from 'react';
import { createTopic } from '../utils/dataManager';

const CreateTopicForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    creator: '',
    tags: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.title.trim()) {
      newErrors.title = '标题不能为空';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = '描述不能为空';
    }
    
    if (!formData.creator.trim()) {
      newErrors.creator = '创建者不能为空';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 处理标签，将字符串转换为数组
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
      
      // 创建话题
      createTopic({
        title: formData.title,
        description: formData.description,
        creator: formData.creator,
        tags: tagsArray
      });
      
      // 重置表单
      setFormData({
        title: '',
        description: '',
        creator: '',
        tags: ''
      });
      
      // 跳转到话题列表页面
      window.location.href = '/topics';
    } catch (error) {
      console.error('创建话题失败:', error);
      alert('创建话题失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          话题标题
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="请输入话题标题"
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          话题描述
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="请输入话题描述"
        />
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="creator" className="block text-sm font-medium text-gray-700 mb-1">
          创建者
        </label>
        <input
          type="text"
          id="creator"
          name="creator"
          value={formData.creator}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.creator ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="请输入创建者名称"
        />
        {errors.creator && <p className="mt-1 text-sm text-red-500">{errors.creator}</p>}
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
          标签（用逗号分隔）
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="例如：电影,科幻,评分"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <a 
          href="/topics" 
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
        >
          取消
        </a>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '创建中...' : '创建话题'}
        </button>
      </div>
    </form>
  );
};

export default CreateTopicForm;