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

export type ApiResponse = {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  data: {
    [ip: string]: {
      [date: string]: {
        ip: string;
        systemDate: string;
        complianceServices: string[];
        nonComplianceServices: string[];
      };
    };
  };
};

export type TableRow = {
  ip: string;
  systemDate: string;
  complianceServices: string[];
  nonComplianceServices: string[];
  complianceStatus: boolean;
};
export interface SystemsListData {
  content: TableRow[];
  totalElements: number;
  totalPages: number;
}
