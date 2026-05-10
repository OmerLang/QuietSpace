import { z } from "zod"

export const signupVaildation = z
  .object({
    fullName: z.string().regex(/^[A-Za-z'-]+ [A-Za-z'-]+$/),
    email: z.email(),
    password: z.string().min(6),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  })

  export const loginVaildation = z
  .object({
    email: z.email(),
    password: z.string().min(1)
  })