'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Spinner } from '@/components/ui/Spinner';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (isClient && !token) {
      router.replace('/login');
    }
  }, [isClient, token, router, pathname]);

  if (!isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return <>{children}</>;
}
