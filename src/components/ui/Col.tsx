'use client';

import React from 'react';

interface ColProps {
  children: React.ReactNode;
  className?: string;
}

const Col: React.FC<ColProps> = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>;
};

export default Col;
