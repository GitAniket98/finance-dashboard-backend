import { z } from "zod"

export const createRecordSchema = z.object({
  amount: z
    .number({ error: "amount must be a number" })
    .positive("amount must be greater than 0"),

  type: z.enum(["income", "expense"], {
    error: "type must be income or expense",
  }),

  category: z
    .string()
    .min(1, "category is required")
    .max(100, "category too long"),

  date: z
    .string()
    .date("date must be a valid date in YYYY-MM-DD format"),

  notes: z
    .string()
    .max(500, "notes too long")
    .optional(),
})

export const updateRecordSchema = z.object({
  amount: z
    .number()
    .positive("amount must be greater than 0")
    .optional(),

  type: z.enum(["income", "expense"], {
    error: "type must be income or expense",
  }).optional(),

  category: z
    .string()
    .min(1, "category is required")
    .max(100, "category too long")
    .optional(),

  date: z
    .string()
    .date("date must be a valid date in YYYY-MM-DD format")
    .optional(),

  notes: z
    .string()
    .max(500, "notes too long")
    .optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "at least one field must be provided",
})

export const recordFilterSchema = z.object({
  type: z.enum(["income", "expense"]).optional(),
  category: z.string().optional(),
  from: z.string().date("from must be a valid date").optional(),
  to: z.string().date("to must be a valid date").optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
})

export type CreateRecordInput = z.infer<typeof createRecordSchema>
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>
export type RecordFilterInput = z.infer<typeof recordFilterSchema>