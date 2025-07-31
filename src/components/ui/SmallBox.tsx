'use client';

import React from 'react';
import Link from 'next/link';

interface SmallBoxProps {
  value: string | number;
  label: string;
  iconClass: string;
  bgColorClass?: string; // e.g., bg-info, bg-success
  link?: string;
  linkText?: string;
  hideFooter?: boolean; // optional flag to explicitly hide footer
}

const SmallBox: React.FC<SmallBoxProps> = ({
  value,
  label,
  iconClass,
  bgColorClass = 'bg-info',
  link,
  linkText = 'More info',
  hideFooter = false,
}) => {
  return (
    <div className={`small-box ${bgColorClass}`}>
      <div className="inner">
        <h3>{value}</h3>
        <p>{label}</p>
      </div>
      <div className="icon">
        <i className={iconClass}></i>
      </div>

      {!hideFooter && link && (
        <Link href={link} className="small-box-footer">
          {linkText} <i className="fas fa-arrow-circle-right"></i>
        </Link>
      )}
    </div>
  );
};

export default SmallBox;