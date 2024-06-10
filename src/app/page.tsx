'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/manage');
  }, [router]);

  return;
};

export default Home;
