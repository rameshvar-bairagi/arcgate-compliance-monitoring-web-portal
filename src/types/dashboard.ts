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

export interface Option<Value extends string | number = string | number> {
  label: string;
  value: Value;
}

export type FilterConfig<M extends boolean = false> = 
  M extends true 
    ? {
        options: Option[];
        selected: Option[];
        onChange: (value: Option[]) => void;
        placeholder?: string;
        isMulti: true; // force true
        isClearable?: boolean;
      }
    : {
        options: Option[];
        selected: Option | null;
        onChange: (value: Option | null) => void;
        placeholder?: string;
        isMulti?: false; // force false/undefined
        isClearable?: boolean;
      };