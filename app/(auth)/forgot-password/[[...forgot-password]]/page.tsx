'use client';

import { useTheme } from 'next-themes';
import Starfield from 'react-starfield';

import { ForgotPassword } from '@/components/pages/auth/ForgotPassword';

const Page = () => {
  const { theme } = useTheme();

  return (
    <section className="flex items-center justify-center flex-col min-h-screen section-padding">
      <Starfield
        starCount={1000}
        starColor={theme === 'dark' ? [255, 255, 255] : [0, 0, 0]}
        speedFactor={0.05}
        backgroundColor={theme === 'dark' ? 'black' : 'white'}
      />
      <ForgotPassword />
    </section>
  );
};

export default Page;
