"use client";

import { useParams } from "next/navigation";
import { TtModelDetails } from "@/components/pages/generations/models/model-details/TtModelDetails";

const Page = () => {
    const { modelId } = useParams();

    return <TtModelDetails modelId={modelId as string} />;
};

export default Page;