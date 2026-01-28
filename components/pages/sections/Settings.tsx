"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import { LanguageSwitcher } from "@/components/functions/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/functions/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useAuth";
import { BackButton } from "@/components/shared/BackButton";

export const Settings = () => {
  const t = useTranslations("Pages.Settings");
  const logoutMutation = useLogout();

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <section className="flex flex-col container mx-auto max-w-6xl rounded-t-2xl px-4 mt-4">
      <BackButton />
      <h1 className="title-text mt-12 md:mt-4 mb-2">{t("Title")}</h1>
      <div className="space-y-4">
        <div className="flex justify-between items-center w-full btn-magic-secondary py-2 px-4 rounded-xl mt-4">
          <div className="text-base">{t("Language")}</div>
          <div>
            <LanguageSwitcher />
          </div>
        </div>
        <div className="flex justify-between items-center w-full btn-magic-secondary py-2 px-4 rounded-xl">
          <div className="text-base">{t("Theme")}</div>
          <div>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
      <div className="flex mt-8">
        <Button className="w-full h-8 cursor-pointer bg-red-400 hover:bg-red-500 text-white" onClick={logout}>
          {t("Logout")}
        </Button>
      </div>
    </section>
  );
};
