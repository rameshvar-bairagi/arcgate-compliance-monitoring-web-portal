'use client';

import React from 'react';
import { FieldError } from 'react-hook-form';

type InputGroupProps = {
  type?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  iconClass?: string;
  error?: string | FieldError;
  required?: boolean;
  groupClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const InputGroup = React.forwardRef<HTMLInputElement, InputGroupProps>(
  (props, ref) => {
    const {
      type = 'text',
      name,
      placeholder,
      value,
      onChange,
      iconClass,
      error,
      required = false,
      groupClassName = 'mb-3',
      ...rest
    } = props;

    return (
      <div className={`input-group ${groupClassName}`}>
        <input
          ref={ref}
          type={type}
          name={name}
          className={`form-control ${error ? 'is-invalid' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          {...rest}
        />
        {iconClass && (
          <div className="input-group-append">
            <div className="input-group-text">
              <span className={iconClass} />
            </div>
          </div>
        )}
        {error && (
          <div className="w-100 text-danger text-sm mt-1">
            {typeof error === 'string' ? error : error.message}
          </div>
        )}
      </div>
    );
  }
);

InputGroup.displayName = 'InputGroup';
export default InputGroup;