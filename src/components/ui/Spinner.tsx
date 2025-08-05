'use client';

import React from 'react';

type SpinnerProps = {
  text?: string;
  className?: string;
};

const Spinner: React.FC<SpinnerProps> = ({ text = 'Loading...', className = '' }) => {
  return (
    <div className={`align-items-center ${className}`}>
      <i className="fas fa-spinner fa-spin text-primary mr-2" />
      <span>{text}</span>
    </div>
  );
};

export default Spinner;
