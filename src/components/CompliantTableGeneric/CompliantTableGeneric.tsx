'use client';
import { getBadgeClass } from '@/utils/commonMethod';
import React from 'react';

interface Metrics {
  [key: string]: boolean;
}

interface ComplianceEntry {
  ip: string;
  systemDate: string;
  compliantMetrics?: Metrics;
  nonCompliantMetrics?: Metrics;
}

interface ComplianceData {
  [ip: string]: ComplianceEntry;
}

interface Props {
  data: {
    [date: string]: {
      complianceList?: ComplianceData;
      nonComplianceList?: ComplianceData;
    };
  };
  type: 'compliant' | 'non-compliant';
}

const CompliantTableGeneric: React.FC<Props> = ({ data, type }) => {
  const rows: { ip: string; date: string; metrics: string[] }[] = [];

  const listKey = type === 'compliant' ? 'complianceList' : 'nonComplianceList';
  const metricsKey =
    type === 'compliant' ? 'compliantMetrics' : 'nonCompliantMetrics';

  // Flatten data into table rows
  Object.entries(data).forEach(([_, lists]) => {
    const list = lists[listKey] || {};
    Object.values(list).forEach((entry) => {
      const metrics = Object.keys(entry[metricsKey] || {});
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
          <th>{type === 'compliant' ? 'Compliant Metrics' : 'Non-Compliant Metrics'}</th>
        </tr>
      </thead>
      <tbody>
        {rows.length > 0 ? (
          rows.map((row, idx) => (
            <tr key={idx}>
              <td>{row.ip}</td>
              <td>{row.date}</td>
              <td>
                {row.metrics.length > 0 ? (
                  row.metrics.map((metric, mIdx) => (
                    <span key={mIdx} className={getBadgeClass(`${mIdx}metric`)}>
                      {metric}
                    </span>
                  ))
                ) : (
                  <span className="text-muted">None</span>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3} className="text-center text-muted">
              No data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default CompliantTableGeneric;