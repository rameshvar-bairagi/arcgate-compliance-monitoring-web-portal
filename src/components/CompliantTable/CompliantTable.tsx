'use client';
import { getBadgeClass } from '@/utils/commonMethod';
import React from 'react';

interface ComplianceMetrics {
  [key: string]: boolean;
}

interface ComplianceEntry {
  ip: string;
  systemDate: string;
  compliantMetrics: ComplianceMetrics;
}

interface ComplianceData {
  [ip: string]: ComplianceEntry;
}

interface Props {
  data: {
    [date: string]: {
      complianceList: ComplianceData;
    };
  };
}

const CompliantTable: React.FC<Props> = ({ data }) => {
  const rows: { ip: string; date: string; metrics: string[] }[] = [];

  // Flatten the data into rows
  Object.entries(data).forEach(([date, { complianceList }]) => {
    Object.values(complianceList).forEach((entry) => {
      const metrics = Object.keys(entry.compliantMetrics);
      rows.push({
        ip: entry.ip,
        date: entry.systemDate,
        metrics,
      });
    });
  });

  return (
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          <th>IP Address</th>
          <th>Date</th>
          <th>Compliant Metrics</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx}>
            <td>{row.ip}</td>
            <td>{row.date}</td>
            <td>
              {row.metrics.map((metric, mIdx) => (
                <span key={mIdx} className={getBadgeClass(`${mIdx}metric`)}>
                  {metric}
                </span>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CompliantTable;