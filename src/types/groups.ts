export type PostGroupsRequestBody = {
  id?: string | number;
  name: string; 
  complianceRuleIds: string[] | number[];
  allSystems: boolean;
  systemIps: string[] | number[] | null;
};