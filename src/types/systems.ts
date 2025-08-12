export type SystemsRequestBody = {
  date: string;
  systemName: string;
  complianceRule: string;
  clientGroup: string;
  metricList: string[] | number[] | null;
  page:number;
  size:number;
  // metricList: ["clamscan_antivirus","luksEncryption","cron_script"];
  // metricList:[3,6,25];
};

export type SystemDayData = {
  ip: string;
  systemDate: string;
  complianceServices?: string[] | null;
  nonComplianceServices?: string[] | null;
};

export type SystemsApiResponse = {
  [ip: string]: {
    [date: string]: SystemDayData;
  };
};

export type SystemsItem = {
  ip: string;
  systemDate: string;
  complianceServices: string[];
  nonComplianceServices: string[];
  complianceStatus: boolean; // true if nonComplianceServices is empty/null
};

export type SystemsListData = Record<string, SystemsItem[]>;
