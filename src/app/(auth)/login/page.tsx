'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import { OAuthButtons } from '@/components/auth/OAuthButtons';
import { useAuthStore } from '@/store/auth.store';

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  React.useEffect(() => {
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        setAuth(user, token);
        router.push('/feed');
      } catch (err) {
        console.error('Failed to parse user from Facebook OAuth callback', err);
      }
    }
  }, [searchParams, router, setAuth]);

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center px-12 border-r border-[#E5E5E5] bg-[#F5F5F5]">
        <div className="max-w-md space-y-6 text-center">
          <h1 className="text-5xl font-serif tracking-tight text-black animate-fade-in">Thoughts.</h1>
          <p className="text-lg text-gray-600 animate-fade-in" style={{ animationDelay: '100ms' }}>
            A minimalist space for your thoughts. Share what matters, without the noise.
          </p>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center px-8 sm:px-12 xl:px-24">
        <div className="mx-auto w-full max-w-sm space-y-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-serif text-black">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-500">Sign in to your account</p>
          </div>

          <div className="space-y-6">
            <LoginForm />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#E5E5E5]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <OAuthButtons />
          </div>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="font-semibold text-black hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </React.Suspense>
  );
}
