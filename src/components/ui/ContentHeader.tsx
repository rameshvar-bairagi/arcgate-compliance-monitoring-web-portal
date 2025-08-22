'use client';

import React from 'react';
import Breadcrumb, { BreadcrumbItem } from '@/components/ui/Breadcrumb';
import Heading from '@/components/ui/Heading';
import Select, { MultiValue } from "react-select";
interface Option {
  value: string;
  label: string;
}

interface ContentHeaderProps {
  title: string;
  breadcrumbItems?: BreadcrumbItem[];
  showSelect?: boolean;
  options?: Option[];
  selected?: Option | null;
  onChange?: (value: Option | null) => void;
  placeholder?: string;
  containerClassName?: string;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({ 
  title,
  breadcrumbItems,
  showSelect = false,
  options = [],
  selected = null,
  onChange,
  placeholder,
  containerClassName = "container-fluid",
}) => {
  return (
    <div className="content-header">
      <div className={containerClassName}>
        <div className="row">
          <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <Heading level={1} variant="primary" className={'m-0'}>{title}</Heading>
          </div>
          <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4"></div>
          <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            {showSelect ? (
              <Select
                options={options}
                value={selected}
                onChange={onChange}
                placeholder={placeholder}
                isClearable={false}
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
