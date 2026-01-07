import React, { useState } from 'react';

interface ShareComponentProps {
  topicTitle: string;
  topicUrl: string;
}

export default function ShareComponent({ topicTitle, topicUrl }: ShareComponentProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(topicUrl);
      setCopied(true);
      // 3秒后恢复初始状态
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error('复制链接失败:', error);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: topicTitle,
          text: `快来看看这个话题: ${topicTitle}`,
          url: topicUrl,
        });
      }
    } catch (error) {
      console.error('分享失败:', error);
    }
  };

  const socialShareLinks = [
    {
      name: '微博',
      icon: '📱',
      url: `https://service.weibo.com/share/share.php?title=${encodeURIComponent(topicTitle)}&url=${encodeURIComponent(topicUrl)}`,
      target: '_blank',
    },
    {
      name: 'QQ',
      icon: '💬',
      url: `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(topicUrl)}&title=${encodeURIComponent(topicTitle)}`,
      target: '_blank',
    },
    {
      name: 'Twitter',
      icon: '🐦',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(topicTitle)}&url=${encodeURIComponent(topicUrl)}`,
      target: '_blank',
    },
  ];

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 dark:text-white">分享话题</h3>
      <div className="flex flex-wrap gap-3">
        {/* 复制链接按钮 */}
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
          aria-label="复制链接"
        >
          <span>{copied ? '✅' : '🔗'}</span>
          <span>{copied ? '已复制' : '复制链接'}</span>
        </button>

        {/* 原生分享按钮（如果浏览器支持） */}
        {navigator.share && (
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-800"
            aria-label="分享"
          >
            <span>📤</span>
            <span>分享</span>
          </button>
        )}

        {/* 社交媒体分享链接 */}
        {socialShareLinks.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target={social.target}
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
            aria-label={`分享到${social.name}`}
          >
            <span>{social.icon}</span>
            <span>{social.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}