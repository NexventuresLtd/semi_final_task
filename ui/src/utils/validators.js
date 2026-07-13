import { z } from "zod";

export const inviteCodeSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  code: z
    .string()
    .min(8, "Invitation code must be at least 8 characters")
    .max(10, "Invitation code looks too long")
    .regex(/^[A-Za-z0-9]+$/, "Code must be letters and numbers only"),
});

export const manualSignupSchema = z
  .object({
    name: z.string().min(2, "Enter your full name"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const totpSchema = z.object({
  code: z.string().length(6, "Enter the 6-digit code").regex(/^\d+$/, "Digits only"),
});