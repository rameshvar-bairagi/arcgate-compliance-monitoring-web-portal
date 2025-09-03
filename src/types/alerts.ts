/* eslint-disable @typescript-eslint/no-explicit-any */
export type AlertsRequestBody = {
  date: string;
  page: number;
  size: number;
};

export type Alerts = { 
  ip: number | string;
  // _rowId: string;
  metricsName: any; 
  alertId: string | number;
  clientGroupId: string | number;
  complianceRuleId: string | number;
  level: string;
  systemDate: string;
  status: string | number;
};

export type AlertsApiResponse = {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  content: Alerts[];
};

export type AlertsUpdateStatus = {
  ip: string;
  status: string;
};
