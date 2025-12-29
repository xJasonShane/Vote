// 生成唯一ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// 格式化日期
export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 计算平均评分
export const calculateAverageRating = (ratings: Array<{ score: number }>): number => {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating.score, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
};

// 获取随机用户ID（用于匿名用户）
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