'use client';

import React, { JSX, ReactNode } from 'react';
import clsx from 'classnames';

type Variant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning';

type HeadingProps = {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  className?: string;
  variant?: Variant;
};

const variantClassMap: Record<Variant, string> = {
  primary: 'text-blue-600',
  secondary: 'text-gray-600',
  danger: 'text-red-600',
  success: 'text-green-600',
  warning: 'text-yellow-600',
};

const Heading: React.FC<HeadingProps> = ({
  level = 1,
  children,
  className,
  variant = 'primary',
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag className={clsx('font-semibold mb-2', variantClassMap[variant], className)}>
      {children}
    </Tag>
  );
};

export default Heading;
