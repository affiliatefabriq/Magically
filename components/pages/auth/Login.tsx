"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useLogin } from "@/hooks/useAuth";
import { LoginFormValues, loginSchema } from "@/lib/validation";

export const Login = () => {
  // Hooks
  const router = useRouter();
  const loginMutation = useLogin();
  const t = useTranslations("Auth.Login");

  // Hook form initialization
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        router.push("/");
        router.refresh();
      },
      onError: (error: any) => {
        console.error(error);
      },
    });
    form.reset();
  };

  return (
    <Form {...form}>
      {/* Back to home button */}
      <Link href="/" className="flex items-center gap-2 w-full max-w-sm mb-2 link-text text-sm z-20">
        <ChevronLeft className="size-4" />
        {t("BackToHomePage")}
      </Link>
      {/* Form */}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4 border p-6 rounded-xl theme z-20"
      >
        <h1 className="title-text">{t("Title")}</h1>

        <Separator orientation="horizontal" className="bg-muted my-6" />

        {/* Username field */}
        <FormField
          control={form.control}
          name="usernameOrEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("UsernameOrEmail")}</FormLabel>
              <FormControl>
                <Input placeholder="johndoe, email@example.com..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Password")}</FormLabel>
              <FormControl>
                <Input type="password" placeholder="ABC12345689..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-end w-full">
          <Link className="link-text text-xs" href="/forgot-password/">
            {t("ForgotPassword")}
          </Link>
        </div>

        {/* Submit button */}
        <Button type="submit" disabled={loginMutation.isPending} className="w-full btn-login">
          {loginMutation.isPending ? t("Button.Sending") : t("Button.Send")}
        </Button>

        <Separator orientation="horizontal" className="bg-secondary my-4" />

        {/* Login redirect */}
        <div className="flex items-center justify-between">
          <Link className="link-text text-sm" href="/register/">
            {t("Register")}
          </Link>
        </div>
      </form>
    </Form>
  );
};
