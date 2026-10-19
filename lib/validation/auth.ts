import { z } from "zod";
import messages from "@/messages/en.json";

type Translate = (key: "email" | "password" | "passwordLength") => string;

export function createLoginSchema(t: Translate) {
  return z.object({
    email: z.string().trim().pipe(z.email(t("email"))),
    password: z.string().min(1, t("password")),
  });
}

export function createSignupSchema(t: Translate) {
  return createLoginSchema(t).extend({
    password: z.string().min(8, t("passwordLength")),
  });
}

export const loginSchema = createLoginSchema((key) => messages.Validation[key]);
export const signupSchema = createSignupSchema((key) => messages.Validation[key]);

export type AuthFormValues = z.infer<typeof loginSchema>;
