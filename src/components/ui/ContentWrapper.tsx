'use client';

import React from 'react';

interface ContentWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const ContentWrapper: React.FC<ContentWrapperProps> = ({ children, className = '' }) => {
  return <div className={`content-wrapper ${className}`}>{children}</div>;
};

export default ContentWrapper;
