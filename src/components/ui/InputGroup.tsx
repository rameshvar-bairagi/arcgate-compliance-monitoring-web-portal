'use client';

import React, { useState } from 'react';
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

    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === 'password';
    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    return (
      <div className={`input-group ${groupClassName}`}>
        <input
          ref={ref}
          type={isPasswordField ? (showPassword ? 'text' : 'password') : type}
          name={name}
          className={`form-control ${error ? 'is-invalid' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          {...rest}
        />
        <div className="input-group-append">
          {isPasswordField ? (
            <div
              className="input-group-text"
              style={{ cursor: 'pointer' }}
              onClick={togglePasswordVisibility}
            >
              <span className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
            </div>
          ) : iconClass ? (
            <div className="input-group-text">
              <span className={iconClass} />
            </div>
          ) : null}
        </div>
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