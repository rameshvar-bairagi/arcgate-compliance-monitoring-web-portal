import { z } from 'zod';

export const rulesSchema = z.object({
  name: z.string().min(1, "Rule name is required!"),
  description: z.string().optional(),
  andRule: z.array(z.union([z.string(), z.number()])).optional(),
  orRule: z.array(z.union([z.string(), z.number()])).optional(),
  allSystems: z.string().min(1, { message: "Apply to is required!" }),
  // clientGroups: z.array(z.union([z.string(), z.number()])).optional(),
  clientGroups: z.union([z.string(), z.number()]).optional(),
})
.refine(
  (data) => (data.andRule?.length ?? 0) > 0 || (data.orRule?.length ?? 0) > 0,
  {
    message: "At least one of AND Metrics or OR Metrics is required!",
    path: ["andRule"],
  }
)
.refine(
  (data) => data.allSystems === "ALL" || (data.allSystems === "CLIENT_GROUP" && !!data.clientGroups),
  {
    message: "Client group is required when apply to is CLIENT_GROUP!",
    path: ["clientGroups"],
  }
);

export type RuleFormData = z.infer<typeof rulesSchema>;
