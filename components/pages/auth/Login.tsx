"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { LoginButton } from "@telegram-auth/react";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useLogin } from "@/hooks/useAuth";
import api from "@/lib/api";
import { LoginFormValues, loginSchema } from "@/lib/validation";

export const Login = () => {
  const router = useRouter();
  const loginMutation = useLogin();
  const queryClient = useQueryClient();
  const t = useTranslations("Auth.Login");

  const [isTelegramWebApp, setIsTelegramWebApp] = useState(false);

  useEffect(() => {
    if ((window as any)?.Telegram?.WebApp?.initData) {
      setIsTelegramWebApp(true);
    }
  }, []);

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

  const handleTelegramAuth = async (user: any) => {
    try {
      const { data } = await api.post(
        "/auth/telegram/widget",
        user
      );

      queryClient.setQueryData(["auth", "me"], data.data.user);
      toast.success("Logged in with Telegram!");
      router.push("/");
    } catch (e) {
      toast.error("Telegram login failed");
    }
  };

  return (
    <Form {...form}>
      <Link href="/" className="flex items-center gap-2 w-full max-w-sm mb-2 link-text text-sm z-20">
        <ChevronLeft className="size-4" />
        {t("BackToHomePage")}
      </Link>

      <div className="w-full max-w-sm space-y-4 border p-6 rounded-xl theme z-20">
        <h1 className="title-text">{t("Title")}</h1>
        <LoginButton
          botUsername="volshebny_bot"
          onAuthCallback={handleTelegramAuth}
          buttonSize="large"
          cornerRadius={5}
          showAvatar
          lang="en"
        />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Password")}</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
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

          <Button type="submit" disabled={loginMutation.isPending} className="w-full btn-login">
            {loginMutation.isPending ? t("Button.Sending") : t("Button.Send")}
          </Button>

          <Separator orientation="horizontal" className="bg-secondary my-4" />

          <div className="flex items-center justify-between">
            <Link className="link-text text-sm" href="/register/">
              {t("Register")}
            </Link>
          </div>
        </form>
      </div>
    </Form>
  );
};