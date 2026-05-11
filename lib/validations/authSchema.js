import { z } from "zod"

export const signupVaildation = z
  .object({
    fullName: z
      .string()
      .min(1, { message: "Please enter a valid name" })
      .regex(/^[A-Za-z'-]+ [A-Za-z'-]+$/, { message: "Must be Firstname LastName" }),
    email: z.email(),
    password: z
      .string()
      .min(6, { message: "Too short! minimum 6 characters" }),
    confirmPassword: z
      .string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  })

  export const loginVaildation = z
  .object({
    email: z.email(),
    password: z.string().min(1, { message: "Please enter a valid password" })
  })