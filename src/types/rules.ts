export type PostRulesRequestBody = {
  name: string;
  description: string;
  clientGroupId: string | number;
  allSystems: boolean;
  andRule: string;
  orRule: string;
};