'use client';

import { useParams } from 'next/navigation';

import { Profile } from '@/components/pages/dynamic/Profile';

const ProfilePage = () => {
  const { username } = useParams();

  return <Profile username={username as string} />;
};

export default ProfilePage;
