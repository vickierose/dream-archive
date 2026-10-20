import { z } from "zod";
import messages from "@/messages/en.json";

type Translate = (key: "email" | "password" | "passwordLength" | "passwordUppercase" | "passwordLowercase" | "passwordNumber" | "passwordMismatch") => string;

export function createLoginSchema(t: Translate) {
  return z.object({
    email: z.string().trim().pipe(z.email(t("email"))),
    password: z.string().min(1, t("password")),
    confirmPassword: z.string().optional(),
  });
}

export function createSignupSchema(t: Translate) {
  return createLoginSchema(t).extend({
    password: z.string()
      .min(8, t("passwordLength"))
      .regex(/\p{Lu}/u, t("passwordUppercase"))
      .regex(/\p{Ll}/u, t("passwordLowercase"))
      .regex(/[0-9]/, t("passwordNumber")),
    confirmPassword: z.string().min(1, t("passwordMismatch")),
  }).refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: t("passwordMismatch"),
    path: ["confirmPassword"],
  });
}

export const loginSchema = createLoginSchema((key) => messages.Validation[key]);
export const signupSchema = createSignupSchema((key) => messages.Validation[key]);

export type AuthFormValues = z.infer<typeof loginSchema>;
