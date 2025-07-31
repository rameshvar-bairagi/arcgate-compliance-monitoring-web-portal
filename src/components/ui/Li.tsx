'use client';

import { forwardRef, HTMLAttributes } from 'react';

type LiProps = HTMLAttributes<HTMLLIElement>;

const Li = forwardRef<HTMLLIElement, LiProps>(({ children, ...props }, ref) => {
  return (
    <li ref={ref} {...props}>
      {children}
    </li>
  );
});

Li.displayName = 'Li'; // Helpful for debugging in React DevTools

export default Li;
