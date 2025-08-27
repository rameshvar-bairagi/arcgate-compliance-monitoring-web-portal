export type PostRulesRequestBody = {
  id?: string | number;
  name: string;
  description: string;
  // clientGroupId: string | number;
  // allSystems: boolean;
  andRule: string;
  orRule: string;
};