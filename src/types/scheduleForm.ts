export type ScheduleForm = {
  id?: string | number;
  name: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  recipients: string[] | string;
  format: 'PDF' | 'CSV' | 'EXCEL' | 'DOC';
  start_date: Date | null;
  status: 'ON' | 'OFF';
};