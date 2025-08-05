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
          <div className="col-12 col-sm-6 col-md-8 col-lg-8 col-xl-8">
            <Heading level={1} variant="primary" className={'m-0'}>{title}</Heading>
          </div>
          <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2"></div>
          <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
            {showSelect ? (
              <CustomSelect
                options={options}
                selected={selected}
                onChange={onChange}
                placeholder={placeholder}
              />
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
