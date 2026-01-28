import { z } from "zod";

// Login Schemas
export const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, "Username or Email is required."),
  password: z.string().min(1, "Password is required."),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

// Registration Schemas
export const emailSchema = z.object({
  email: z.email("Invalid email address."),
});
export const otpSchema = z.object({
  otp: z.string().min(6, "Your one-time password must be 6 characters."),
});

export const registerDetailsSchema = z.object({
  fullname: z.string().min(3, "Fullname must be at least 3 characters.").max(32),
  username: z.string().min(3, "Username must be at least 3 characters.").max(16),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export type EmailFormValues = z.infer<typeof emailSchema>;
export type OtpFormValues = z.infer<typeof otpSchema>;
export type RegisterDetailsFormValues = z.infer<typeof registerDetailsSchema>;

// Password Reset Schemas
export const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address."),
});
export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// Photo Generation
export const formSchema = z.object({
  prompt: z.string().min(3, "Prompt is required"),
  aspect_ratio: z.string(),
  images: z.array(z.instanceof(File)).optional(),
  publish: z.boolean(),
  model_type: z.string(),
});

export type FormValues = z.infer<typeof formSchema>;

export const paySchema = z.object({
  amount: z.number().min(10, "Minimal amount is 10"),
});

export type PayFormValues = z.infer<typeof paySchema>;
