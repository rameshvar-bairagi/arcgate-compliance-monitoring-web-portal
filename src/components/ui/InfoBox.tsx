'use client';

import React from 'react';

interface InfoBoxProps {
  iconClass: string; // e.g. "fas fa-cog"
  bgColorClass?: string; // e.g. "bg-info"
  label: string;
  value: string | number;
  unit?: string; // e.g. "%"
}

const InfoBox: React.FC<InfoBoxProps> = ({
  iconClass,
  bgColorClass = 'bg-info',
  label,
  value,
  unit,
}) => {
  return (
    <div className="info-box">
      <span className={`info-box-icon ${bgColorClass} elevation-1`}>
        <i className={iconClass}></i>
      </span>

      <div className="info-box-content">
        <span className="info-box-text">{label}</span>
        <span className="info-box-number">
          {value} {unit && <small>{unit}</small>}
        </span>
      </div>
    </div>
  );
};

export default InfoBox;