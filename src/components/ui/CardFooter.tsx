// components/CardFooter.tsx

import React from 'react';
import Button from './Button';

interface CardFooterProps {
  rightLabel?: string;
  onLeftClick?: () => void;
  onRightClick?: () => void;
}

const CardFooter: React.FC<CardFooterProps> = ({
  rightLabel,
  onLeftClick,
  onRightClick
}) => {
  return (
    <div className="card-footer clearfix">
      {rightLabel && (
        <Button onClick={onRightClick} className="btn btn-sm btn-secondary float-right">
          {rightLabel}
        </Button>
      )}
    </div>
  );
};

export default CardFooter;
