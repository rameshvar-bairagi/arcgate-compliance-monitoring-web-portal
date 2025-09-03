/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { JSX } from 'react';
import { getBadgeClass } from '@/utils/commonMethod';
import { renderToStaticMarkup } from 'react-dom/server';

type RendererOptions = {
  field?: string;
  row?: any; // generic row type
  onAction?: (row: any, newStatus: string) => void;
};

export const dtRenderer = (
  value: any,
  { field, row, onAction }: RendererOptions = {}
): string => {
  // console.log("dtRenderer value:", value, "Type:", typeof value);
  if (field === "alertNonComplaintMetric" && typeof value === 'string') {
    const items = Array.isArray(value) ? value : value.split(',').map(v => v.trim());

    return items
      .map((v: any) => `<span class="badge badge-light m-1">${typeof v === 'object' ? JSON.stringify(v) : v}</span>`)
      .join(" ");
  }
  
  if (Array.isArray(value)) {
    return value
      .map((v: any) => `<span class="badge badge-light m-1">${typeof v === 'object' ? JSON.stringify(v) : v}</span>`)
      .join(" ");
  }

  if (typeof value === "object") {
    if (value === null) {
      return `<span class="text-muted">-</span>`;
    }
    return `<span>${value?.name ?? JSON.stringify(value)}</span>`;
  }

  if (typeof value === "boolean") {
    if (field === "complianceStatus") {
      return `<span class="${value ? "text-success" : "text-danger"}">${value ? "Compliant" : "Non-Compliant"}</span>`;
    }
    return `<span class="${value ? "text-success" : "text-danger"}">${value ? "Yes" : "No"}</span>`;
  }

  if (value === null || value === undefined || value === "" || value === 0) {
    return `<span class="text-muted">-</span>`;
  }

  if (field === "ip") {
    return `<span class="font-mono">${value}</span>`;
  }

  if (field === "level") {
    return `<span class="${getBadgeClass(value)}">
      ${value}
    </span>`;
  }

  return `<span>${value}</span>`;
};

const AlertButton = ({ row, onAction }: { row: any; onAction: any }) => {
  const handleClick = () => {
    const nextStatus =
      row.status === "Acknowledge"
        ? "Acknowledged"
        : row.status === "Acknowledged"
          ? "Resolved"
          : row.status;

    onAction(row, nextStatus);
  };

  let className = "btn btn-secondary btn-xs";
  let text = "Resolved";
  let disabled = true;

  if (row.status === "Acknowledge") {
    className = "btn btn-warning btn-xs";
    text = "Acknowledge";
    disabled = false;
  } else if (row.status === "Acknowledged") {
    className = "btn btn-info btn-xs";
    text = "Acknowledged";
    disabled = false;
  }

  return (
    <button className={className} onClick={handleClick} disabled={disabled}>
      {text}
    </button>
  );
};

AlertButton.displayName = "AlertButton";

const MemoizedAlertButton = React.memo(AlertButton);

export const getAlertActionButton = (
  row: any,
  onAction: (row: any, newStatus: string) => void
) => {
  return <MemoizedAlertButton row={row} onAction={onAction} />;
};