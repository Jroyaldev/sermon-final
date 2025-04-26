import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, Flame, Clock } from 'lucide-react';
import { SessionContextValue } from 'next-auth/react';
import LoginButton from '@/components/LoginButton';
import UserAccountMenu from './UserAccountMenu';
import MobileNav from './MobileNav';

interface AppHeaderProps {
  session: SessionContextValue['data'];
  status: SessionContextValue['status'];
  formattedTime: string;
  greeting: string;
}

export default function AppHeader({
  session,
  status,
  formattedTime,
  greeting,
}: AppHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/10 bg-white/90 backdrop-blur-md shadow-none">
        <div className="flex items-center justify-between h-14 px-4 sm:px-8 lg:px-16 max-w-screen-xl mx-auto w-full">
          {/* Left: Logo & Title (Desktop) */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group" aria-label="Ministry Suite Dashboard">
              <motion.div
                className="flex items-center justify-center w-8 h-8 rounded bg-gradient-to-br from-accent-3/30 to-accent-3/10 text-accent-1 group-hover:shadow transition-all duration-200"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
              >
                <Flame className="w-4 h-4 text-accent-1" />
              </motion.div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xl font-serif font-semibold text-foreground tracking-tight group-hover:text-accent-1 transition-colors duration-150 leading-tight">
                  Ministry Suite
                </span>
                <span className="text-[11px] text-muted-foreground/80 tracking-widest uppercase font-light mt-0.5">
                  Built by pastors, for pastors
                </span>
              </div>
            </Link>
          </div>
          {/* Right: Meta Info & Auth */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-4 text-right">
              <span className="text-sm font-light italic text-foreground/80">{greeting}</span>
              <span className="flex items-center gap-1 text-muted-foreground/90 text-xs font-medium tracking-wider">
                <Clock className="w-4 h-4" />
                {formattedTime}
              </span>
            </div>
            {status === 'loading' ? (
              <div className="flex items-center gap-2 h-8 w-28 rounded-full bg-muted/30 animate-pulse">
                <div className="w-6 h-6 rounded-full bg-muted ml-1"></div>
                <div className="h-3 w-14 bg-muted rounded"></div>
              </div>
            ) : status === 'authenticated' && session?.user ? (
              <UserAccountMenu session={session} />
            ) : (
              <LoginButton />
            )}
          </div>
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <motion.button
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex items-center justify-center rounded-full w-8 h-8 border border-border/20 hover:bg-accent-3/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Open navigation menu"
              whileTap={{ scale: 0.96 }}
            >
              <Menu className="w-5 h-5 text-foreground/80" />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        session={session}
        status={status}
        greeting={greeting}
        formattedTime={formattedTime}
      />
    </>
  );
} 