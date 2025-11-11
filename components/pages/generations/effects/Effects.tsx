import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/ui/magic/everhault-card";
import { useTranslations } from "next-intl";

export const Effects = () => {
    const t = useTranslations("Pages.Effects");

    return (
        <section className="flex flex-col flex-wrap container mx-auto max-w-6xl rounded-t-2xl px-2 mt-4">
            <h1 className="title-text">{t("title")}</h1>
            <div className="grid-3 gap-4 mt-6">
                <Link
                    href="/create/effects/photo-effects"
                    className="border border-black/[0.2] dark:border-white/[0.2] flex flex-col items-start w-full p-2 relative"
                >
                    <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
                    <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
                    <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
                    <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

                    <Image
                        src="/effects/2.jpg"
                        alt="2"
                        width={1024}
                        height={1024}
                        className="rounded-xl"
                    />

                    <div className="p-2 font-mono">
                        <h1 className="text-xl font-bold">{t("PhotoEffects.title")}</h1>

                        <ul className="font-thin text-xs text-neutral-700 dark:text-neutral-500 mt-4 space-y-1">
                            <li>- {t("PhotoEffects.restoration")}</li>
                            <li>- {t("PhotoEffects.art")}</li>
                            <li>- {t("PhotoEffects.style")}</li>
                            <li>- {t("PhotoEffects.cartoon")}</li>
                        </ul>
                    </div>
                </Link>
                <Link
                    href="/create/effects/video-effects"
                    className="border border-black/[0.2] dark:border-white/[0.2] flex flex-col items-start w-full p-2 relative"
                >
                    <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
                    <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
                    <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
                    <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

                    <video
                        width="1024"
                        height="1024"
                        autoPlay
                        loop
                        preload="metadata"
                        className="rounded-xl"
                    >
                        <source src="/effects/1.mp4" />
                    </video>

                    <div className="p-2 font-mono">
                        <h1 className="text-xl font-bold">{t("VideoEffects.title")}</h1>

                        <ul className="font-thin text-xs text-neutral-700 dark:text-neutral-500 mt-4 space-y-1">
                            <li>- {t("VideoEffects.camera")}</li>
                            <li>- {t("VideoEffects.visual")}</li>
                        </ul>
                    </div>
                </Link>
                <Link
                    href="/create/effects/photo-editor"
                    className="border border-black/[0.2] dark:border-white/[0.2] flex flex-col items-start w-full p-2 relative"
                >
                    <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
                    <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
                    <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
                    <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

                    <Image
                        src="/effects/3.jpg"
                        alt="3"
                        width={1024}
                        height={1024}
                        className="rounded-xl"
                    />

                    <div className="p-2 font-mono">
                        <h1 className="text-xl font-bold">{t("PhotoEditor.title")}</h1>

                        <ul className="font-thin text-xs text-neutral-700 dark:text-neutral-500 mt-4 space-y-1">
                            <li>- {t("PhotoEditor.angle")}</li>
                        </ul>
                    </div>
                </Link>
            </div>
        </section >
    );
};