"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForgotPassword } from "@/hooks/useAuth";
import { ForgotPasswordFormValues, forgotPasswordSchema } from "@/lib/validation";

export const ForgotPassword = () => {
  const t = useTranslations("Auth.ForgotPassword");
  const [message, setMessage] = useState("");
  const forgotPasswordMutation = useForgotPassword();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    forgotPasswordMutation.mutate(values, {
      onSuccess: (data: any) => setMessage(data.message),
      onError: (error: any) => setMessage(error),
    });
  };

  return (
    <div className="w-full max-w-sm theme z-20">
      <Link href="/login" className="flex items-center gap-2 w-full max-w-sm mb-2 link-text text-sm">
        <ChevronLeft />
        {t("BackToLogin")}
      </Link>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 border p-6 rounded-xl">
          <h1 className="title-text">{t("Title")}</h1>
          <p className="text-sm text-muted-foreground">{t("Subtitle")}</p>

          {!message ? (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Email")}</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={forgotPasswordMutation.isPending} className="w-full btn-login">
                {forgotPasswordMutation.isPending ? t("Button.Sending") : t("Button.Send")}
              </Button>
            </>
          ) : (
            <p className="text-center text-green-500">{message}</p>
          )}
        </form>
      </Form>
    </div>
  );
};
