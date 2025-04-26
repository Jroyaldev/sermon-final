import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { SessionContextValue } from 'next-auth/react';

interface DateTimeViewProps {
  session: SessionContextValue['data'];
  formattedDate: string;
  formattedTime: string;
  greeting: string;
}

export default function DateTimeView({
  session,
  formattedDate,
  formattedTime,
  greeting,
}: DateTimeViewProps) {
  return (
    <motion.div 
      className="py-12 md:py-16 flex flex-col items-center justify-center relative" // Added relative positioning for z-index context
      key="date-time-view" // Key for AnimatePresence
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-accent-3/30 to-accent-1/20 flex items-center justify-center mb-10 shadow-xl shadow-accent-1/5 border border-accent-1/10"
      >
        <Flame className="w-14 h-14 md:w-16 md:h-16 text-accent-1/80" />
      </motion.div>
      
      <motion.h2 
        className="text-4xl md:text-6xl lg:text-7xl font-serif text-foreground tracking-tight mb-5 font-light"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
      >
        {formattedDate}
      </motion.h2>
      
      <motion.div 
        className="flex items-center justify-center gap-4 mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }}
      >
        <div className="w-2 h-2 rounded-full bg-accent-1/40" />
        <span className="text-3xl md:text-5xl font-light text-foreground/80 tracking-wider">
          {formattedTime}
        </span>
        <div className="w-2 h-2 rounded-full bg-accent-1/40" />
      </motion.div>
      
      {session?.user?.name && (
        <motion.p
          className="mt-10 text-xl md:text-2xl font-light text-foreground/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.9, ease: "easeOut" }}
        >
          Peace be with you, <span className="font-serif italic text-accent-1/80">{session.user.name.split(' ')[0]}</span>
        </motion.p>
      )}

      {/* Subtle background decoration */}
      <motion.div
        className="absolute inset-0 -z-10 overflow-hidden opacity-10 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2, delay: 1 }}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-accent-1/40 to-transparent blur-3xl" />
      </motion.div>
      
      <motion.div
        className="w-full max-w-md mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.1 }}
      >
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-accent-1/20 to-transparent rounded-full" />
      </motion.div>
    </motion.div>
  );
} 