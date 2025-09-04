export type ScheduleForm = {
  reportType: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  recipients: string[];
  format: 'PDF' | 'CSV' | 'Excel' | 'DOC';
  startDate: Date | null;
  status: 'Active' | 'Inactive';
};