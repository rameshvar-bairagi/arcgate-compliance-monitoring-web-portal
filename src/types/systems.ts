export type SystemsRequestBody = {
  date: string;
  systemName: string;
  complianceRule: string;
  clientGroup: string | number;
  metricList: string[] | number[] | null;
  page:number;
  size:number;
  sortBy: string;
  sortDirection: string;
  // metricList: ["clamscan_antivirus","luksEncryption","cron_script"];
  // metricList:[3,6,25];
};

export type SystemsApiResponse = {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  data: {
    [date: string]: {
      ip: string;
      systemDate: string;
      complianceServices: string[];
      nonComplianceServices: string[];
    }; // each date has an array of TableRow
  };
};

export type TableRow = {
  ip: string;
  _rowId: string;
  systemDate: string;
  complianceServices: string[];
  nonComplianceServices: string[];
  complianceStatus: boolean;
};
export interface SystemsListData {
  content: TableRow[];
  pageNumber: number,
  totalElements: number;
  totalPages: number;
}

export interface ExportOverAllData {
  ip: string;
  complianceStatus: boolean;
  complianceServices: string[];
  nonComplianceServices: string[];
  systemDate: string;
  _rowId: string;
};
