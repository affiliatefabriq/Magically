'use client';

import { useParams } from 'next/navigation';

import { Interested } from '@/components/pages/dynamic/Interested';

const Page = () => {
  const { username } = useParams();

  return <Interested username={username as string} />;
};

export default Page;
