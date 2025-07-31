'use client';

import { ReactNode } from 'react';

type NavProps = {
  children?: ReactNode;
  className?: string;
};

export default function Nav({ children, className = '' }: NavProps) {
  return (
    <nav className={`${className}`}>
      {children}
    </nav>
  );
}
