"use client";

import { useParams } from "next/navigation";

import { Profile } from "@/components/pages/dynamic/Profile";

const Page = () => {
  const { username } = useParams();

  return <Profile username={username as string} />;
};

export default Page;
