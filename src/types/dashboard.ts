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

// export type FilterConfig = {
//   options: Option[];
//   selected: Option | readonly Option[] | null;
//   onChange: (value: Option | readonly Option[] | null) => void;
//   placeholder?: string;
//   isMulti?: boolean;
// };


// export type FilterConfig<Value extends string | number = string | number> =
//   | {
//       options: Option<Value>[];
//       selected: Option<Value> | null;
//       onChange: (value: Option<Value> | null) => void;
//       placeholder?: string;
//       isMulti?: false;
//     }
//   | {
//       options: Option<Value>[];
//       selected: readonly Option<Value>[];
//       onChange: (value: readonly Option<Value>[]) => void;
//       placeholder?: string;
//       isMulti: true;
//     };

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