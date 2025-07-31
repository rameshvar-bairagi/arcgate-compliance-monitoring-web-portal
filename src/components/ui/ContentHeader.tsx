'use client';

import React from 'react';
import Breadcrumb, { BreadcrumbItem } from '@/components/ui/Breadcrumb';
import Heading from '@/components/ui/Heading';

interface ContentHeaderProps {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
}

const ContentHeader: React.FC<ContentHeaderProps> = ({ title, breadcrumbItems }) => {
  return (
    <div className="content-header">
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-6">
            <Heading level={1} variant="primary" className={'m-0'}>{title}</Heading>
          </div>
          <div className="col-sm-6">
            
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentHeader;
