import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  variant?: 'rectangle' | 'circle' | 'text';
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  className = '',
  variant = 'rectangle',
}) => {
  const baseStyles = `skeleton animate-pulse ${className}`;
  const shapeStyles = {
    width,
    height,
    borderRadius: variant === 'circle' ? '50%' : variant === 'text' ? '4px' : '8px',
  };

  return <div className={baseStyles} style={shapeStyles}></div>;
};

// 骨架屏组件集合
export const SkeletonLoader = {
  // 话题列表骨架屏
  TopicList: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
      {[...Array(4)].map((_, index) => (
        <div 
          key={index} 
          className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 animate-slide-in-right"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <Skeleton variant="rectangle" width="80%" height="24px" className="mb-4" />
          <Skeleton variant="rectangle" width="100%" height="16px" className="mb-2" />
          <Skeleton variant="rectangle" width="100%" height="16px" className="mb-2" />
          <Skeleton variant="rectangle" width="60%" height="16px" className="mb-6" />
          <div className="flex flex-wrap gap-2 mb-6">
            {[...Array(3)].map((_, tagIndex) => (
              <Skeleton 
                key={tagIndex} 
                variant="rectangle" 
                width="80px" 
                height="24px" 
                className="rounded-full"
              />
            ))}
          </div>
          <div className="flex justify-between items-center">
            <Skeleton variant="rectangle" width="100px" height="16px" />
            <div className="flex space-x-6">
              {[...Array(3)].map((_, statIndex) => (
                <Skeleton 
                  key={statIndex} 
                  variant="rectangle" 
                  width="40px" 
                  height="16px"
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  ),

  // 话题详情骨架屏
  TopicDetail: () => (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="bg-white p-8 rounded-lg shadow-md mb-8 animate-slide-in-left">
        <Skeleton variant="rectangle" width="100%" height="36px" className="mb-4" />
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {[...Array(3)].map((_, index) => (
            <Skeleton 
              key={index} 
              variant="rectangle" 
              width="120px" 
              height="16px"
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {[...Array(4)].map((_, tagIndex) => (
            <Skeleton 
              key={tagIndex} 
              variant="rectangle" 
              width="100px" 
              height="24px" 
              className="rounded-full"
            />
          ))}
        </div>
        <div className="space-y-3 mb-6">
          {[...Array(4)].map((_, paraIndex) => (
            <Skeleton 
              key={paraIndex} 
              variant="rectangle" 
              width="100%" 
              height="16px"
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-4">
          {[...Array(2)].map((_, btnIndex) => (
            <Skeleton 
              key={btnIndex} 
              variant="rectangle" 
              width="120px" 
              height="40px" 
              className="rounded-lg"
            />
          ))}
        </div>
      </div>
      
      {/* 内容项列表骨架屏 */}
      <div className="mb-8 animate-slide-in-right">
        <Skeleton variant="rectangle" width="200px" height="32px" className="mb-6" />
        <div className="grid grid-cols-1 gap-6">
          {[...Array(3)].map((_, itemIndex) => (
            <div 
              key={itemIndex} 
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <Skeleton variant="rectangle" width="60%" height="24px" />
                <Skeleton variant="circle" width="40px" height="40px" />
              </div>
              <div className="space-y-2 mb-6">
                {[...Array(2)].map((_, paraIndex) => (
                  <Skeleton 
                    key={paraIndex} 
                    variant="rectangle" 
                    width="100%" 
                    height="16px"
                  />
                ))}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, starIndex) => (
                    <Skeleton 
                      key={starIndex} 
                      variant="rectangle" 
                      width="24px" 
                      height="24px"
                    />
                  ))}
                </div>
                <Skeleton variant="rectangle" width="100px" height="36px" className="rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 评论区骨架屏 */}
      <div className="animate-slide-in-left">
        <Skeleton variant="rectangle" width="150px" height="32px" className="mb-6" />
        {[...Array(3)].map((_, commentIndex) => (
          <div 
            key={commentIndex} 
            className="bg-white rounded-lg shadow-md p-6 border border-gray-100 mb-4"
          >
            <div className="flex gap-4 mb-4">
              <Skeleton variant="circle" width="48px" height="48px" />
              <div className="flex-1">
                <Skeleton variant="rectangle" width="120px" height="16px" className="mb-2" />
                <Skeleton variant="rectangle" width="80px" height="14px" className="mb-3" />
                <Skeleton variant="rectangle" width="100%" height="16px" className="mb-2" />
                <Skeleton variant="rectangle" width="100%" height="16px" className="mb-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),

  // 表单骨架屏
  Form: () => (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 animate-fade-in">
      <Skeleton variant="rectangle" width="200px" height="32px" className="mb-6" />
      {[...Array(3)].map((_, fieldIndex) => (
        <div key={fieldIndex} className="mb-6 animate-slide-in-right">
          <Skeleton variant="rectangle" width="100px" height="16px" className="mb-2" />
          <Skeleton variant="rectangle" width="100%" height="48px" className="rounded-lg" />
        </div>
      ))}
      <div className="flex justify-end gap-4">
        {[...Array(2)].map((_, btnIndex) => (
          <Skeleton 
            key={btnIndex} 
            variant="rectangle" 
            width="120px" 
            height="48px" 
            className="rounded-lg"
          />
        ))}
      </div>
    </div>
  ),

  // 加载状态指示器
  LoadingSpinner: ({ className = '' }) => (
    <div className={`flex justify-center items-center ${className}`}>
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  ),

  // 加载文本指示器
  LoadingText: ({ text = '加载中...', className = '' }) => (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="w-10 h-10 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-gray-600 animate-pulse-light">{text}</p>
    </div>
  ),
};

export default Skeleton;