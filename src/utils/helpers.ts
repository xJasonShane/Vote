/**
 * 生成唯一标识符
 * @returns {string} 生成的唯一ID字符串
 */
export const generateId = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

/**
 * 格式化日期为本地化字符串
 * @param {Date} date - 要格式化的日期对象
 * @returns {string} 格式化后的日期字符串，格式为：YYYY-MM-DD HH:MM
 */
export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * 计算平均评分
 * @param {Array<{ score: number }>} ratings - 评分数组，每个评分对象包含score字段
 * @returns {number} 平均评分，保留一位小数
 */
export const calculateAverageRating = (
  ratings: Array<{ score: number }>
): number => {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating.score, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
};

/**
 * 获取或生成匿名用户ID
 * 在服务器端渲染时，返回临时ID；在客户端，从localStorage获取或生成新ID
 * @returns {string} 匿名用户ID
 */
export const getRandomUserId = (): string => {
  // 在服务器端渲染时，localStorage不存在，返回临时ID
  if (typeof localStorage === 'undefined') {
    return `temp-${generateId()}`;
  }
  const userId = localStorage.getItem('anonymousUserId');
  if (userId) return userId;
  const newUserId = `anon-${generateId()}`;
  localStorage.setItem('anonymousUserId', newUserId);
  return newUserId;
};
