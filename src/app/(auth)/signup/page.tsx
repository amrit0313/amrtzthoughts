import * as React from 'react';
import Link from 'next/link';
import { SignupForm } from '@/components/auth/SignupForm';
import { OAuthButtons } from '@/components/auth/OAuthButtons';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center px-12 border-r border-[#E5E5E5] bg-[#F5F5F5]">
        <div className="max-w-md space-y-6 text-center">
          <h1 className="text-5xl font-serif tracking-tight text-black">Thoughts.</h1>
          <p className="text-lg text-gray-600">
            Join a minimalist space for your thoughts. Share what matters, without the noise.
          </p>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center px-8 sm:px-12 xl:px-24">
        <div className="mx-auto w-full max-w-sm space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-serif text-black">Create an account</h2>
            <p className="mt-2 text-sm text-gray-500">Sign up to get started</p>
          </div>

          <div className="space-y-6">
            <SignupForm />

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
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-black hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
