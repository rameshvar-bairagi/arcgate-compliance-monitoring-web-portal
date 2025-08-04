'use client';

import React from 'react';
import Breadcrumb, { BreadcrumbItem } from '@/components/ui/Breadcrumb';
import Heading from '@/components/ui/Heading';
import CustomSelect from '@/components/ui/CustomSelect';

interface ContentHeaderProps {
  title: string;
  breadcrumbItems?: BreadcrumbItem[];
  showSelect?: boolean;
  options?: { label: string; value: string }[];
  selected?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({ 
  title,
  breadcrumbItems,
  showSelect = false,
  options = [],
  selected,
  onChange,
  placeholder,
}) => {
  return (
    <div className="content-header">
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-6">
            <Heading level={1} variant="primary" className={'m-0'}>{title}</Heading>
          </div>
          <div className="col-sm-3"></div>
          <div className="col-sm-3">
            {showSelect ? (
              <div style={{ minWidth: '200px' }}>
                <CustomSelect
                  options={options}
                  selected={selected}
                  onChange={onChange}
                  placeholder={placeholder}
                />
              </div>
            ) : (
              breadcrumbItems && (
                <Breadcrumb items={breadcrumbItems} />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentHeader;
