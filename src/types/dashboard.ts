export type ComplianceRequestBody = {
  date: string;
  complianceRule: string;
  clientGroup: string;
};

type AlertItem = {
  systemDate: string;
  ip: string;
  metricsName: string;
  level: string;
};

export type AlertsData = Record<string, AlertItem[]>;
