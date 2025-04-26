import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LayoutDashboard, User, LogOut, Clock, Flame } from 'lucide-react'; // Added Flame
import { signOut, SessionContextValue } from 'next-auth/react';
import LoginButton from '@/components/LoginButton';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  session: SessionContextValue['data'];
  status: SessionContextValue['status'];
  greeting: string;
  formattedTime: string;
}

export default function MobileNav({
  isOpen,
  onClose,
  session,
  status,
  greeting,
  formattedTime,
}: MobileNavProps) {
  const backdropVariants = {
    open: { opacity: 1, transition: { duration: 0.3 } },
    closed: { opacity: 0, transition: { duration: 0.3, delay: 0.2 } },
  };

  const drawerVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 120, damping: 20, delay: 0.1 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" // Slightly darker backdrop
            initial="closed"
            animate="open"
            exit="closed"
            variants={backdropVariants}
            onClick={onClose}
            aria-hidden="true" // Hide from screen readers
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] bg-background shadow-xl z-50 lg:hidden flex flex-col"
            initial="closed"
            animate="open"
            exit="closed"
            variants={drawerVariants}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
               {/* Mobile Menu Header Logo/Title */}
              <Link href="/" className="flex items-center gap-2 group" onClick={onClose}>
                 <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-accent-3/40 to-accent-3/20 text-accent-1">
                   <Flame className="w-4 h-4 text-accent-1" />
                 </div>
                 <span className="text-md font-serif text-foreground tracking-tight leading-tight">
                    Ministry Suite
                 </span>
              </Link>
              <motion.button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring tactile-button"
                whileTap={{ scale: 0.9 }}
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="flex-grow p-4 flex flex-col overflow-y-auto">
              {/* Time & Greeting */}
              <div className="mb-4 p-3 bg-muted/50 rounded-lg text-sm">
                 <span className="font-light italic text-foreground/80 block mb-1">{greeting}</span>
                 <div className="flex items-center justify-start gap-1.5 text-muted-foreground">
                   <Clock className="w-3.5 h-3.5" />
                   <span className="text-xs font-light tracking-wide">{formattedTime}</span>
                 </div>
              </div>

              {/* Navigation */}
              <nav className="flex-grow flex flex-col gap-1">
                 <Link
                   href="/"
                   className="flex items-center gap-3 px-3 py-2 text-sm text-foreground font-medium hover:bg-accent-3/10 rounded-md transition-colors"
                   onClick={onClose}
                 >
                   <LayoutDashboard className="w-4 h-4 text-accent-1" />
                   Dashboard
                 </Link>
                 {/* === Add other primary navigation links here === */}
                 {/* Example:
                 <Link href="/sermons" className="..." onClick={onClose}>
                   <NotebookPen className="w-4 h-4" /> Sermons
                 </Link>
                 */}
              </nav>

              {/* Auth Section */}
              <div className="mt-auto border-t border-border pt-4 space-y-2">
                {status === 'loading' && (
                  <div className="h-10 bg-muted rounded animate-pulse w-full"></div>
                )}
                {status === 'authenticated' && session?.user && (
                  <>
                    <div className="px-3 py-2 text-sm border border-border rounded-md bg-muted/30">
                      <p className="text-xs font-medium text-muted-foreground mb-0.5">Signed in as</p>
                      <p className="font-medium truncate flex items-center gap-1.5">
                        <User className="w-4 h-4 text-accent-1 flex-shrink-0" />
                        <span className="truncate">{session.user.name}</span>
                      </p>
                    </div>
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-destructive/50 tactile-button"
                      onClick={() => {
                        signOut({ callbackUrl: '/auth/signin' });
                        onClose();
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </>
                )}
                {status === 'unauthenticated' && (
                  <LoginButton />
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 