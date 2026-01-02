import React, { type ReactNode } from 'react';
import LandingPage from '@/components/LandingPage/LandingPage';
import { useSession } from 'next-auth/react';
import { LoadingSpinner } from './LoadingSpinner';

interface Props {
  children: ReactNode;
}

const Page: React.FC<Props> = ({ children }) => {
  const { status } = useSession();

  if (status === 'loading') {
    return <LoadingSpinner size={70} />;
  }

  if (status === 'unauthenticated') {
    return <LandingPage />;
  }

  // Default to rendering authenticated children
  return <>{children}</>;
};

export default Page;
