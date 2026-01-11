"use client";

import Link from "next/link";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useActiveGeneration } from "@/hooks/useGenerations";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export const GenerationToaster = () => {
    const t = useTranslations("Components.Toaster");
    const { data: job } = useActiveGeneration();
    const [showFinal, setShowFinal] = useState<
        "success" | "failed" | null
    >(null);

    useEffect(() => {
        if (!job) return;

        if (job.status === "completed") {
            setShowFinal("success");
            setTimeout(() => setShowFinal(null), 7000);
        }

        if (job.status === "failed") {
            setShowFinal("failed");
            setTimeout(() => setShowFinal(null), 7000);
        }
    }, [job]);

    if (!job && !showFinal) return null;

    const progress =
        typeof job?.progress === "number"
            ? Math.min(Math.max(job.progress, 0), 100)
            : null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: -100, opacity: 1 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 1 }}
                className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none px-4"
            >
                <div className="pointer-events-auto bg-background/80 backdrop-blur-md border px-4 py-3 rounded-2xl shadow-lg w-[320px]">
                    <div className="flex items-center gap-3">
                        {(job?.status === "pending" ||
                            job?.status === "processing") && (
                                <Loader2 className="animate-spin text-lime-500 size-4" />
                            )}

                        {showFinal === "success" && (
                            <CheckCircle2 className="text-lime-500 size-5" />
                        )}

                        {showFinal === "failed" && (
                            <XCircle className="text-red-500 size-5" />
                        )}

                        <span className="text-sm font-medium flex-1">
                            {job?.status === "pending" && `${t("Pending")}...`}
                            {job?.status === "processing" && `${t("Processing")}...`}
                            {showFinal === "success" && `${t("Success")}...`}
                            {showFinal === "failed" && `${t("Fail")}...`}
                        </span>

                        {job && (
                            <Link
                                href={`/create/generation/${job.id}`}
                                className="text-xs text-muted-foreground hover:underline"
                            >
                                {t("Open")}
                            </Link>
                        )}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
