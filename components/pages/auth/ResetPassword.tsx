"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useResetPassword } from "@/hooks/useAuth";
import { ResetPasswordFormValues, resetPasswordSchema } from "@/lib/validation";

interface ResetPasswordProps {
  token: string;
}

export const ResetPassword = ({ token }: ResetPasswordProps) => {
  const router = useRouter();
  const t = useTranslations("Auth.ResetPassword");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const resetPasswordMutation = useResetPassword();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: ResetPasswordFormValues) => {
    setError("");
    setMessage("");
    resetPasswordMutation.mutate(
      { token, values },
      {
        onSuccess: (data: any) => {
          setMessage(data.message);
          setTimeout(() => router.push("/login"), 3000);
        },
        onError: (error: any) => setError(error),
      }
    );
  };

  return (
    <div className="w-full max-w-sm glassmorphism z-20">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 border p-6 rounded-xl">
          <h1 className="title-text">{t("Title")}</h1>
          {!message ? (
            <>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("NewPassword")}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("ConfirmPassword")}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={resetPasswordMutation.isPending} className="w-full">
                {resetPasswordMutation.isPending ? t("Button.Sending") : t("Button.Send")}
              </Button>
              {error && <p className="text-center text-red-500">{error}</p>}
            </>
          ) : (
            <p className="text-center text-green-500">{message}</p>
          )}
        </form>
      </Form>
    </div>
  );
};
