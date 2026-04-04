import { z } from "zod"

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "name must be at least 2 characters")
    .max(100, "name too long"),

  email: z.email("invalid email format"),

  password: z
    .string()
    .min(6, "password must be at least 6 characters"),

  role: z
    .enum(["admin", "analyst", "viewer"], {
      error: "role must be admin, analyst or viewer",
    })
    .optional()
    .default("viewer"),
})

export const loginSchema = z.object({
  email: z.email("invalid email format"),

  password: z
    .string()
    .min(1, "password is required"),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>