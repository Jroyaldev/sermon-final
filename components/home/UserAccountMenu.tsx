import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, LogOut } from 'lucide-react';
import { signOut, SessionContextValue } from 'next-auth/react';
import useOnClickOutside from '@/hooks/useOnClickOutside'; // Import the hook

interface UserAccountMenuProps {
  session: SessionContextValue['data'];
}

export default function UserAccountMenu({ session }: UserAccountMenuProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null); // Ref for the dropdown container

  // Use the hook to close the menu when clicking outside
  useOnClickOutside(menuRef, () => setShowUserMenu(false));

  // Added a check for session and user existence
  if (!session?.user?.name) {
    return null; // Or a loading/placeholder state if preferred
  }

  const userName = session.user.name;
  const userInitial = userName.charAt(0);
  const userFirstName = userName.split(' ')[0];

  return (
    <div className="relative" ref={menuRef}> {/* Attach the ref here */}
      <motion.button
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-3/10 hover:bg-accent-3/20 border border-accent-3/20 transition-all duration-200 focus:outline-none tactile-button"
        onClick={() => setShowUserMenu(!showUserMenu)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-expanded={showUserMenu}
        aria-label="User menu"
      >
        <div className="w-7 h-7 rounded-full bg-accent-1/15 flex items-center justify-center text-accent-1 font-serif">
          {userInitial}
        </div>
        <span className="hidden sm:block text-sm font-medium text-foreground">{userFirstName}</span>
        <ChevronDown className={`w-4 h-4 text-foreground/50 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {showUserMenu && (
          <motion.div
            className="absolute right-0 mt-2 w-48 rounded-xl bg-background/95 backdrop-blur-lg border border-border shadow-lg overflow-hidden z-50"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <div className="p-3 border-b border-border/50">
              <p className="text-xs font-medium text-foreground/70">Signed in as</p>
              <p className="text-sm font-medium truncate">{userName}</p>
            </div>
            <div className="p-1">
              <button
                className="w-full text-left px-3 py-2 text-sm text-destructive/80 hover:bg-destructive/10 rounded-md flex items-center gap-2 transition-colors focus:outline-none tactile-button"
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 