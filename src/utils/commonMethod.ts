import { format, subDays } from 'date-fns';

export const formatDateTime = (dateString: string): string => {
  const formattedDate = dateString
      ? format(new Date(dateString), 'dd-MM-yyyy')
      : 'Unknown';
  return formattedDate;
//   const date = new Date(dateString);
//   const pad = (n: number) => (n < 10 ? '0' + n : n);
//   return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const getBadgeClass = (level: string = ''): string => {
  switch (level.toLowerCase()) {
    case 'l1':
      return 'badge badge-info m-1';
    case 'l2':
      return 'badge badge-warning m-1';
    case 'l3':
      return 'badge badge-danger m-1';
    default:
      return 'badge badge-light m-1';
  }
};

type ComplianceItem = {
  date: string;
  complianceCount: number;
  nonComplianceCount: number;
  totalWorkStations: number;
};

export const getComplianceTotals = (data?: ComplianceItem[]) => {
  const safeData = Array.isArray(data) ? data : [];

  return safeData.reduce(
    (acc, item) => {
      const compliance = item.complianceCount || 0;
      const nonCompliance = item.nonComplianceCount || 0;

      acc.totalWorkStations += item.totalWorkStations || 0;
      acc.activeWorkStations += compliance + nonCompliance;
      acc.complianceCount += compliance;
      acc.nonComplianceCount += nonCompliance;
      return acc;
    },
    {
      totalWorkStations: 0,
      activeWorkStations: 0,
      complianceCount: 0,
      nonComplianceCount: 0,
    }
  );
};

export const getChartDataFromCompliance = (complianceData: ComplianceItem[]) => {
  const safeData = Array.isArray(complianceData) ? complianceData : [];

  const labels: string[] = [];
  const compliantCounts: number[] = [];
  const nonCompliantCounts: number[] = [];

  safeData.forEach((item) => {
    const formattedDate = item.date
      ? format(new Date(item.date), 'dd-MM-yyyy')
      : 'Unknown';
    labels.push(formattedDate);
    compliantCounts.push(item.complianceCount || 0);
    nonCompliantCounts.push(item.nonComplianceCount || 0);
  });

  return {
    labels,
    datasets: [
      {
        label: 'Compliant',
        backgroundColor: '#007bff',
        borderColor: '#007bff',
        data: compliantCounts,
        // barPercentage: 1.0,
        // categoryPercentage: 0.8
      },
      {
        label: 'Non-Compliant',
        backgroundColor: '#6c757d',
        borderColor: '#6c757d',
        data: nonCompliantCounts,
        // barPercentage: 1.0,
        // categoryPercentage: 0.8
      },
    ],
  };
};

export const getDateOptions = () => {
  const today = new Date();
  return [
    { label: 'Today', value: 'Today' },
    { label: 'Yesterday', value: 'Yesterday' },
    { label: 'Last 3 Days', value: '3' },
    { label: 'Last 4 Days', value: '4' },
    { label: 'Last 5 Days', value: '5' },
    { label: 'Last 6 Days', value: '6' },
    { label: 'Last 7 Days', value: '7' },
    // { label: 'Today', value: format(today, 'yyyy-MM-dd') },
    // { label: 'Yesterday', value: format(subDays(today, 1), 'yyyy-MM-dd') },
    // { label: 'Last 3 Days', value: format(subDays(today, 2), 'yyyy-MM-dd') },
    // { label: 'Last 4 Days', value: format(subDays(today, 3), 'yyyy-MM-dd') },
    // { label: 'Last 5 Days', value: format(subDays(today, 4), 'yyyy-MM-dd') },
    // { label: 'Last 6 Days', value: format(subDays(today, 5), 'yyyy-MM-dd') },
    // { label: 'Last 7 Days', value: format(subDays(today, 6), 'yyyy-MM-dd') },
  ];
};

export const getReportTypeOption = () => {
  return [
    { label: 'Overall Compliance Summary', value: 'overall_compliance_cummary' },
    { label: 'SOC2 Compliance', value: 'soc2_compliance' },
    { label: 'Client Group Compliance', value: 'client_group_compliance' },
    { label: 'Alert History', value: 'Alert History' },
  ];
};

export const getExportOption = () => {
  return [
    { label: 'CSV', value: 'csv' },
    { label: 'EXCEL', value: 'excel' },
    { label: 'PDF', value: 'pdf' },
    { label: 'PRINT', value: 'print' },
  ];
};

export interface Option<Value extends string | number = string | number> {
  label: string;
  value: Value;
}

export const getIpOptions = (ips: string[]): Option[] => {
  return ips.map((ip) => ({
    label: ip,
    value: ip,
  }));
};

type MetricInput =
  | string
  | { metricsName: string; metricsDbName: string; id: string };

export const getMetricsOptions = (metrics: MetricInput[]): Option[] => {
  return metrics.map((m, idx) =>
    typeof m === "string"
      ? { label: m, value: m }
      : { label: m.metricsName, value: m.id }
  );
};

export const capitalize = (str?: string) => {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

interface Rule {
  id: number;
  name: string;
  description: string;
  andRule: string;
  orRule: string;
}

export const getRulesOptions = (rules: Rule[]): Option[] => {
  return rules.map(rule => ({
    label: rule.name,  // show rule name
    value: rule.id     // use id as value
  }));
}


interface ClientGroup {
  id: number;
  name: string;
  complianceRuleId: string | number;
}
export const getClientGroupOptions = (clientGroup: ClientGroup[]): Option[] => {
  return clientGroup.map(group => ({
    label: group.name,  // show group name
    value: group.id     // use id as value
  }));
}