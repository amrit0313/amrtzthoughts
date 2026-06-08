'use client';

import * as React from 'react';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { LogOut, MessageSquare, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { navItems } from './Sidebar';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-close drawer on navigation
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#E5E5E5] bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/feed" className="flex items-center gap-2">
            <span className="text-2xl font-serif font-bold text-black tracking-tight">Thoughts.</span>
          </Link>

          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Hamburger — mobile only */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden h-8 w-8 px-0"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>

                {/* Desktop-only quick links */}
                <Link href="/messages" className="hidden sm:flex text-gray-500 hover:text-black transition-colors h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100">
                  <MessageSquare className="h-5 w-5" />
                </Link>
                <Link href="/profile" className="hidden sm:block">
                  <Avatar src={user.profilePic} initials={user.name?.[0] || user.email[0]} size="sm" />
                </Link>
                <Button variant="ghost" size="sm" onClick={logout} className="hidden sm:flex text-gray-500 hover:text-black">
                  <LogOut className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Sign out</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile drawer — rendered at document.body so it is NOT clipped by the sticky header */}
      {isMounted && isMobileMenuOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer panel */}
          <aside className="relative flex h-full w-64 max-w-xs flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] px-4 h-16 flex-shrink-0">
              <span className="text-xl font-serif font-bold text-black tracking-tight">Thoughts.</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 px-0 rounded-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-5 w-5 text-gray-500" />
              </Button>
            </div>

            <nav className="flex-1 overflow-y-auto space-y-1 px-4 py-6">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors',
                      isActive
                        ? 'bg-[#F5F5F5] text-black'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
                        isActive ? 'text-black' : 'text-gray-400 group-hover:text-black'
                      )}
                      aria-hidden="true"
                    />
                    {item.label}
                  </Link>
                );
              })}

              <button
                onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                className="group flex w-full items-center px-4 py-3 text-sm font-medium rounded-md transition-colors text-red-600 hover:bg-red-50"
              >
                <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-red-500" aria-hidden="true" />
                Sign out
              </button>
            </nav>

            <div className="flex-shrink-0 px-4 py-4">
              <div className="rounded-md bg-[#F5F5F5] p-4 text-xs text-gray-500 text-center border border-[#E5E5E5]">
                Thoughts. 2026
              </div>
            </div>
          </aside>
        </div>,
        document.body
      )}
    </>
  );
}
