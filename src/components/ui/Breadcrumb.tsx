'use client';

import React from 'react';
import Ol from './OL';
import Li from './Li';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <Ol className={`breadcrumb float-sm-right ${className}`}>
      {items.map((item, index) => (
        <Li
          key={index}
          className={`breadcrumb-item${item.active ? ' active' : ''}`}
          aria-current={item.active ? 'page' : undefined}
        >
          {item.href && !item.active ? (
            <Link href={item.href} className={'text-primary'}>{item.label}</Link>
          ) : (
            item.label
          )}
        </Li>
      ))}
    </Ol>
  );
};

export default Breadcrumb;
