import React, { useState, useCallback } from 'react';

interface ShareComponentProps {
  topicTitle: string;
  topicUrl: string;
}

interface SocialSharePlatform {
  name: string;
  icon: string;
  url: string;
  target: string;
  color: string;
}

export default function ShareComponent({ topicTitle, topicUrl }: ShareComponentProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // 增强的复制链接功能，添加通知反馈
  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(topicUrl);
      setCopied(true);
      
      // 显示浏览器通知（如果允许）
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('链接已复制', {
          body: '话题链接已复制到剪贴板',
          icon: '/favicon.ico',
        });
      }
      
      // 3秒后恢复初始状态
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error('复制链接失败:', error);
      
      // 降级方案：使用 execCommand
      if (typeof document !== 'undefined') {
        const textArea = document.createElement('textarea');
        textArea.value = topicUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
        } catch (execError) {
          console.error('降级复制链接失败:', execError);
        }
        
        document.body.removeChild(textArea);
      }
    }
  }, [topicUrl]);

  // 增强的原生分享功能
  const handleShare = useCallback(async () => {
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
  }, [topicTitle, topicUrl]);

  // 生成 QR 码的 data URL
  const generateQRCodeDataUrl = useCallback(() => {
    // 使用简单的 QR 码生成算法（基于文本编码）
    // 实际项目中可以使用更复杂的 QR 码生成库
    const size = 200;
    const margin = 10;
    const data = encodeURIComponent(topicUrl);
    
    // 使用 Google Charts API 生成 QR 码（简单实现）
    return `https://chart.googleapis.com/chart?chs=${size}x${size}&cht=qr&chl=${data}&choe=UTF-8`;
  }, [topicUrl]);

  // 扩展的社交媒体平台列表
  const socialShareLinks: SocialSharePlatform[] = [
    {
      name: '微博',
      icon: '📱',
      url: `https://service.weibo.com/share/share.php?title=${encodeURIComponent(topicTitle)}&url=${encodeURIComponent(topicUrl)}`,
      target: '_blank',
      color: 'from-red-500 to-red-600',
    },
    {
      name: 'QQ',
      icon: '💬',
      url: `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(topicUrl)}&title=${encodeURIComponent(topicTitle)}`,
      target: '_blank',
      color: 'from-blue-500 to-blue-600',
    },
    {
      name: 'Twitter',
      icon: '🐦',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(topicTitle)}&url=${encodeURIComponent(topicUrl)}`,
      target: '_blank',
      color: 'from-blue-400 to-blue-500',
    },
    {
      name: 'Facebook',
      icon: '📘',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(topicUrl)}`,
      target: '_blank',
      color: 'from-blue-600 to-blue-700',
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(topicUrl)}`,
      target: '_blank',
      color: 'from-blue-700 to-blue-800',
    },
    {
      name: 'Pinterest',
      icon: '📌',
      url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(topicUrl)}&description=${encodeURIComponent(topicTitle)}`,
      target: '_blank',
      color: 'from-red-600 to-red-700',
    },
  ];

  return (
    <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          分享话题
        </h3>
        <button
          onClick={() => setShowQR(!showQR)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={showQR ? '关闭二维码' : '显示二维码'}
        >
          <span className="text-xl">{showQR ? '🔒' : '📱'}</span>
        </button>
      </div>

      {/* 话题信息预览 */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{topicTitle}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 break-all">{topicUrl}</p>
      </div>

      {/* 核心分享功能区 */}
      <div className="space-y-6">
        {/* 快速分享按钮 */}
        <div className="flex flex-wrap gap-3">
          {/* 复制链接按钮 */}
          <button
            onClick={handleCopyLink}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:-translate-y-1 ${copied ? 
              'bg-green-500 text-white shadow-lg focus:ring-green-500' : 
              'bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 dark:text-white hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-600 dark:hover:to-gray-500 shadow-md focus:ring-blue-500'}
            `}
            aria-label="复制链接"
          >
            <span className="text-lg">{copied ? '✅' : '🔗'}</span>
            <span>{copied ? '已复制到剪贴板' : '复制链接'}</span>
          </button>

          {/* 原生分享按钮（如果浏览器支持） */}
          {typeof navigator.share === 'function' && (
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="分享到系统"
            >
              <span className="text-lg">📤</span>
              <span>分享</span>
            </button>
          )}

          {/* 社交媒体分享平台 */}
          {socialShareLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target={social.target}
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-5 py-3 bg-gradient-to-r ${social.color} text-white rounded-lg font-medium hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              aria-label={`分享到${social.name}`}
              title={`分享到${social.name}`}
            >
              <span className="text-lg">{social.icon}</span>
              <span>{social.name}</span>
            </a>
          ))}
        </div>

        {/* QR 码分享 */}
        {showQR && (
          <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg animate-fade-in">
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">扫描二维码分享</h4>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
              <img 
                src={generateQRCodeDataUrl()} 
                alt="话题分享二维码" 
                className="w-48 h-48" 
                loading="lazy"
              />
            </div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
              扫描二维码，在手机上查看和分享这个话题
            </p>
          </div>
        )}

        {/* 分享提示 */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>📢 分享这个话题，让更多人参与讨论和评分！</p>
        </div>
      </div>
    </div>
  );
}