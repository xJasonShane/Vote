// AppProvider - 应用的根状态管理组件

import React, { type ReactNode } from 'react';
import { TopicProvider } from '../context/TopicContext';

interface AppProviderProps {
  children: ReactNode;
}

// 应用根 Provider，整合所有 Context
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <TopicProvider>
      {children}
    </TopicProvider>
  );
};

export default AppProvider;
