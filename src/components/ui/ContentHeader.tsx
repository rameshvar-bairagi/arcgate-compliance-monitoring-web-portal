'use client';

import React from 'react';
import Breadcrumb, { BreadcrumbItem } from '@/components/ui/Breadcrumb';
import Heading from '@/components/ui/Heading';
import Select from "react-select";
import { FilterConfig, Option } from '@/types/dashboard';
interface ContentHeaderProps {
  title: string;
  breadcrumbItems?: BreadcrumbItem[];
  filters?: FilterConfig<true>[] | FilterConfig<false>[]; 
  containerHeaderClassName?: string;
  containerClassName?: string;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({ 
  title,
  breadcrumbItems,
  filters = [],
  containerHeaderClassName = "content-header",
  containerClassName = "container-fluid",
}) => {
  
  return (
    <div className={containerHeaderClassName}>
      <div className={containerClassName}>
        <div className="row">
          <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <Heading level={1} variant="primary" className={'m-0'}>{title}</Heading>
          </div>

          <div className="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 row justify-content-end">
            {filters.length > 0 ? (
              filters.map((filter, idx) => {
                const commonProps = {
                  options: filter.options,
                  placeholder: filter.placeholder,
                  isClearable: filter.isClearable,
                  className: "w-100 select-filter",
                  classNamePrefix: "react-select",
                };

                return (
                  <div key={idx} className="col-12 col-sm-12 col-xs-12 col-md-4 col-lg-4 col-xl-4 mb-2">
                    {filter.isMulti ? (
                      <Select<Option<string | number>, true>
                        {...commonProps}
                        isMulti
                        value={filter.selected}
                        onChange={(newValue) =>
                          filter.onChange(newValue as Option<string | number>[])
                        }
                      />
                    ) : (
                      <Select<Option<string | number>, false>
                        {...commonProps}
                        isMulti={false}
                        value={filter.selected}
                        onChange={(newValue) =>
                          filter.onChange(newValue as Option<string | number> | null)
                        }
                      />
                    )}
                  </div>
                );
              })
            ) : (
              breadcrumbItems && <Breadcrumb items={breadcrumbItems} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentHeader;
