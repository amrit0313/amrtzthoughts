'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Users, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  const { user, logout } = useAuthStore();
  
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E5E5E5] bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/feed" className="flex items-center gap-2">
          <span className="text-2xl font-serif font-bold text-black tracking-tight">Thoughts.</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-4">
              <Link href="/profile" className="hidden sm:block">
                <Avatar src={user.profilePic} initials={user.name?.[0] || user.email[0]} size="sm" />
              </Link>
              <Button variant="ghost" size="sm" onClick={logout} className="text-gray-500 hover:text-black">
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
