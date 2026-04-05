import { z } from "zod"

export const updateUserSchema = z.object({
  role: z
    .enum(["admin", "analyst", "viewer"], {
      error: "role must be admin, analyst or viewer",
    })
    .optional(),

  status: z
    .enum(["active", "inactive"], {
      error: "status must be active or inactive",
    })
    .optional(),
}).refine(data => data.role || data.status, {
  message: "at least one of role or status must be provided",
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>