import React from "react";

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export default function CardBody({ children, className = "" }: CardBodyProps) {
  return <div className={`card-body ${className}`.trim()}>{children}</div>;
}
