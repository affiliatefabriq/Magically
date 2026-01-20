"use client";

import { useParams } from "next/navigation";

import { Publication } from "@/components/pages/dynamic/Publication";

const Page = () => {
  const { publicationId } = useParams();

  return <Publication publicationId={publicationId as string} />;
};

export default Page;
