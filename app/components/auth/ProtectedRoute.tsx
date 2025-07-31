'use client';

import { useAuth } from '@/app/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const route = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      route.push('/login');
    }
  }, [isLoading, isAuthenticated, route]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return null;
}
