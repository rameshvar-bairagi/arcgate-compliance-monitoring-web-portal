export type PostGroupsRequestBody = {
  id?: string | number;
  name: string;
  systemIps: string[] | number[]; 
  complianceRuleIds: string[] | number[];
};