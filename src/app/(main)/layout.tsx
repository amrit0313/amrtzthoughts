import * as React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { ChatWindow } from '@/components/chat/ChatWindow';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <div className="mx-auto flex w-full max-w-7xl flex-1 items-start">
          <Sidebar />
          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
      <ChatWindow />
    </AuthGuard>
  );
}
