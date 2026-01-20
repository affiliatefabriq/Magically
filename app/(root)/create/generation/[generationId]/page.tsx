"use client";

import { useParams } from "next/navigation";

import { Generation } from "@/components/pages/dynamic/Generation";

const Page = () => {
  const { generationId } = useParams();

  return <Generation generationId={generationId as string} />;
};

export default Page;
