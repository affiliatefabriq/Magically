"use client";

import { useUser } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import { useTransactions } from "@/hooks/useTransaction";

import { JobEmpty } from "@/components/states/empty/Empty";
import { NotAuthorized } from "@/components/states/error/Error";
import { SearchLoader } from "@/components/states/loaders/Loaders";

export const Transactions = () => {
    const t = useTranslations("Pages.Library");
    const { data: user } = useUser();

    const { data: transactionsData, isLoading: isTransLoading } = useTransactions(1, 20);

    if (!user) return <div className="state-center"><NotAuthorized /></div>

    return (
        <div className="section-padding">
            <h1 className="title-text mt-4 mb-6">{t("Transactions")}</h1>

            {isTransLoading && <SearchLoader />}

            {!isTransLoading && transactionsData?.rows?.length === 0 && (
                <JobEmpty />
            )}

            <div className="flex flex-col gap-2">
                {transactionsData?.rows?.map((tx: any) => (
                    <div
                        key={tx.id}
                        className="flex justify-between items-center p-3 border rounded-xl theme"
                    >
                        <div className="flex flex-col">
                            <span className="font-medium text-sm">{tx.description}</span>
                            <span className="text-xs text-muted-foreground">
                                {new Date(tx.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <span
                            className={`font-bold ${tx.type === "credit"
                                ? "text-lime-400 dark:text-lime-500"
                                : "text-red-500"
                                }`}
                        >
                            {tx.type === "credit" ? "+" : "-"}
                            {tx.amount} ✦
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};