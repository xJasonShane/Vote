import React, { useState, useCallback } from 'react';
import { addContentItem } from '../../utils/dataManager';
import type { Topic } from '../../types';

interface FormData {
  title: string;
  description: string;
  imageUrl: string;
}

interface AddContentItemFormProps {
  topic: Topic;
  onClose: () => void;
  onSuccess: () => void;
}

function AddContentItemForm({
  topic,
  onClose,
  onSuccess,
}: AddContentItemFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    imageUrl: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // URL验证函数
  const validateUrl = useCallback((url: string): boolean => {
    if (!url.trim()) return true; // 允许空URL
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }, []);

  // 表单字段变化处理
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

  // 表单验证
  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = '标题不能为空';
    } else if (formData.title.length < 2) {
      newErrors.title = '标题长度至少为2个字符';
    } else if (formData.title.length > 100) {
      newErrors.title = '标题长度不能超过100个字符';
    }

    if (formData.description.length > 500) {
      newErrors.description = '描述长度不能超过500个字符';
    }

    if (formData.imageUrl.trim() && !validateUrl(formData.imageUrl)) {
      newErrors.imageUrl = '请输入有效的图片URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateUrl]);

  // 表单提交处理
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setGeneralError(null);

    try {
      // 只传递非空的imageUrl
      const contentItemData = {
        ...formData,
        imageUrl: formData.imageUrl.trim() || undefined,
      };

      addContentItem(topic.id, contentItemData);
      onSuccess();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '添加内容项失败，请稍后重试';
      setGeneralError(errorMessage);
      console.error('添加内容项失败:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, topic.id, onSuccess, validateForm]);

  // 取消按钮处理
  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">添加内容项</h3>
          <button
            type="button"
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 text-xl focus:outline-none"
            aria-label="关闭表单"
          >
            ×
          </button>
        </div>

        {generalError && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-6">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              标题 *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="请输入内容项标题"
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
              描述
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="请输入内容项描述"
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="imageUrl"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              图片URL（可选）
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.imageUrl ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="请输入图片URL"
              aria-describedby={errors.imageUrl ? 'imageUrl-error' : undefined}
            />
            {errors.imageUrl && (
              <p id="imageUrl-error" className="mt-1 text-sm text-red-500">
                {errors.imageUrl}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              disabled={isSubmitting}
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isSubmitting ? '添加中...' : '添加内容项'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default React.memo(AddContentItemForm);
