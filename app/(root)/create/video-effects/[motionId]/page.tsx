"use client";

import { useParams } from "next/navigation";

import { GenerateVideo } from "@/components/pages/generations/effects/video/GenerateVideo";

const Page = () => {
  const { motionId } = useParams();

  return <GenerateVideo motionId={motionId as string} />;
};

export default Page;
