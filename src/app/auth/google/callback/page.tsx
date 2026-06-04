'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Spinner } from '@/components/ui/Spinner';
import { useAuthStore } from '@/store/auth.store';

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  React.useEffect(() => {
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        setAuth(user, token);
        setTimeout(() => {
          router.push('/feed');
        }, 500);
      } catch (err) {
        console.error('Failed to parse user from OAuth callback', err);
        router.push('/login?error=auth_failed');
      }
    } else {
      router.push('/login?error=auth_failed');
    }
  }, [searchParams, router, setAuth]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <Spinner size="lg" className="mb-4" />
      <p className="font-serif text-xl text-black">Signing you in...</p>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <React.Suspense fallback={
      <div className="flex min-h-screen flex-col items-center justify-center bg-white">
        <Spinner size="lg" className="mb-4" />
        <p className="font-serif text-xl text-black">Signing you in...</p>
      </div>
    }>
      <GoogleCallbackContent />
    </React.Suspense>
  );
}
