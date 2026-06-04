'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Users, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/feed', label: 'Feed', icon: Home },
  { href: '/users', label: 'Explore Users', icon: Globe },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/friends', label: 'Friends', icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-[#E5E5E5] bg-white h-[calc(100vh-4rem)] sticky top-16 pt-8 pb-4">
      <nav className="flex-1 space-y-1 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                isActive 
                  ? "bg-[#F5F5F5] text-black" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-black"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                  isActive ? "text-black" : "text-gray-400 group-hover:text-black"
                )}
                aria-hidden="true"
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
      
      <div className="px-4 mt-auto">
        <div className="rounded-md bg-[#F5F5F5] p-4 text-xs text-gray-500 text-center border border-[#E5E5E5]">
          Thoughts. 2026
        </div>
      </div>
    </aside>
  );
}
