import { z } from 'zod';

export const groupsSchema = z.object({
  name: z.string().min(1, "Group name is required!"),
  complianceRuleId: z.union([z.string(), z.number()]),
  allSystems: z.string().min(1, { message: "Apply to is required!" }),
  systemIps: z.array(z.union([z.string(), z.number()])),
})
.refine(
  (data) => !!data.complianceRuleId,
  {
    message: "Compliance rule is required!",
    path: ["complianceRuleId"], // attach error to complianceRuleId
  }
)
.refine(
  (data) => data.allSystems === "ALL" || (data.allSystems === "SYSTEM_IP" && !!data.systemIps?.length),
  {
    message: "At least one system ip is required!",
    path: ["systemIps"],
  }
)
// .refine(
//   (data) => (data.systemIps?.length ?? 0) > 0,
//   {
//     message: "At least one system ip is required!",
//     path: ["systemIps"],   // attach error to systemIps
//   }
// );

export type GroupFormData = z.infer<typeof groupsSchema>;
