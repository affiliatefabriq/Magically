'use client';

import { useTheme } from 'next-themes';
import Starfield from 'react-starfield';

import { Register } from '@/components/pages/auth/Register';

const Page = () => {
  const { theme } = useTheme();

  return (
    <section className="flex items-center justify-center flex-col min-h-screen section-padding">
      {/* Theme-aware starfield background */}
      <Starfield
        starCount={1000}
        starColor={theme === 'dark' ? [255, 255, 255] : [0, 0, 0]}
        speedFactor={0.05}
        backgroundColor={theme === 'dark' ? 'black' : 'white'}
      />
      <Register />
    </section>
  );
};

export default Page;
