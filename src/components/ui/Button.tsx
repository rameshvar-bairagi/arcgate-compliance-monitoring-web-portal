// src/components/ui/Button.tsx
'use client';

import { ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
};

export default function Button({ variant = 'primary', size = 'md', className, ...rest }: Props) {
  const styles = classNames(
    'btn',
    {
      'btn-primary': variant === 'primary',
      'btn-secondary': variant === 'secondary',
      'btn-danger': variant === 'danger',
      'btn-sm': size === 'sm',
      'btn-lg': size === 'lg',
    },
    className
  );

  return <button className={styles} {...rest} />;
}
