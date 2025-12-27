"use client";

import Link from "next/link";
import Image from "next/image";

import { useUser } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useGenerationJob } from "@/hooks/useGenerations";

import { Button } from "@/components/ui/button";
import { JobEmpty } from "@/components/states/empty/Empty";
import { JobLoader } from "@/components/states/loaders/Loaders";
import { NotAuthorized } from "@/components/states/error/Error";
import {
    Loader2,
    Share2,
    Download,
    CheckCircle,
    ChevronLeft
} from "lucide-react";

export const Generation = ({ generationId }: { generationId: string }) => {
    const router = useRouter();
    const t = useTranslations("Pages.Job");
    const { data: user } = useUser();
    const { data: job, isLoading } = useGenerationJob(generationId as string);

    if (!user) return <div className="state-center"><NotAuthorized /></div>
    if (isLoading) return <div className="state-center"><JobLoader /></div>;
    if (user && !job) return <div className="state-center"><JobEmpty /></div>;

    const handleDone = () => {
        router.push("/");
    };

    return (
        <section className="flex flex-col items-center justify-center min-h-[80vh] gap-6 px-4">
            <div className="fixed md:hidden h-12 backdrop-blur-2xl w-full top-0 left-0 right-0 text-sm z-10">
                <Link href="/" className="flex items-center justify-start h-full ml-2 link-text">
                    <ChevronLeft className="size-4 " />
                    {/* <span>{t("back")}</span> */}
                </Link>
            </div>

            <h1 className="title-text">
                {job.status === "pending" ? t("Status.Pending")  : t("Status.Finish")}
            </h1>

            <div className="relative w-full max-w-lg aspect-square bg-muted rounded-xl overflow-hidden flex items-center justify-center border">
                {job.status === "pending" ? (
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="size-10 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground animate-pulse">{t("Status.Pending")} {job.service}...</p>
                    </div>
                ) : job.status === "failed" ? (
                    <div className="text-red-500 text-center p-4">
                        {t("Status.Fail")} <br />
                        <span className="text-xs text-muted-foreground">{job.errorMessage}</span>
                    </div>
                ) : (
                    job.service.includes('kling') || job.service.includes('higgsfield') ? (
                        <video src={job.resultUrl} controls autoPlay loop className="w-full h-full object-cover" />
                    ) : (
                        <Image src={job.resultUrl} alt={job.meta.prompt} fill className="object-cover" />
                    )
                )}
            </div>

            {job.status === "completed" && (
                <div className="flex flex-col w-full max-w-lg gap-3">
                    <div className="flex gap-2">
                        <Button className="flex-1 btn-outline" onClick={() => window.open(job.resultUrl, '_blank')}>
                            <Download className="mr-2 size-4" /> {t("Button.Save")}
                        </Button>
                        <Button className="flex-1 btn-outline">
                            <Share2 className="mr-2 size-4" /> {t("Button.Share")}
                        </Button>
                    </div>
                    <Button className="w-full btn-solid" onClick={handleDone}>
                        <CheckCircle className="mr-2 size-4" /> {t("Button.Done")}
                    </Button>
                </div>
            )}
        </section>
    );
};