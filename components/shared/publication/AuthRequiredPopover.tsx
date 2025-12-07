"use client";

import Link from "next/link";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface AuthRequiredPopoverProps {
    children: React.ReactNode;
    message?: string;
}

export const AuthRequiredPopover = ({
    children,
    message
}: AuthRequiredPopoverProps) => {
    const t = useTranslations("Components.AuthRequired");

    return (
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent className="w-full mx-4">
                <div className="flex flex-col gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">
                            {t("title")}
                        </h4>
                        <p className="text-sm text-muted-foreground max-w-48">
                            {message || t("message")}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/login" className="flex-1">
                            <Button className="w-full btn-outline" variant="outline">
                                {t("login")}
                            </Button>
                        </Link>
                        <Link href="/register" className="flex-1">
                            <Button className="w-full btn-solid">
                                {t("register")}
                            </Button>
                        </Link>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};