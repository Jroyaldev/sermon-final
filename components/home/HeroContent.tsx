import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { SessionContextValue } from 'next-auth/react';

interface HeroContentProps {
  session: SessionContextValue['data'];
  formattedDate: string;
  formattedTime: string;
  currentQuote: { text: string; reference: string };
}

// Animation variants (could potentially be moved to a shared location)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, 
      delayChildren: 0.05,
      duration: 0.4, 
      ease: "easeOut" 
    }
  }
};

export default function HeroContent({
  session,
  formattedDate,
  formattedTime,
  currentQuote,
}: HeroContentProps) {
  return (
    <>
      {/* Date/Time Block Removed */}

      {/* Premium hero content */}
      <motion.div 
        className="relative z-10 max-w-2xl mx-auto text-center py-12 md:py-20"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
      >
        <motion.h1 
          className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight tracking-tighter mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        >
          Ministry begins here.
        </motion.h1>
        <motion.p 
          className="text-lg sm:text-xl text-muted-foreground/90 mt-2 mb-8 font-light leading-relaxed tracking-wider max-w-xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        > 
          Tools to shepherd, teach, and lead—without the noise.
        </motion.p>
        <motion.div
          className="relative w-full max-w-lg mt-10 mx-auto flex flex-col items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        >
          <div className="w-12 border-t border-accent-1/30 mb-4" />
          <p className="text-base italic text-muted-foreground/80 max-w-md mx-auto"> 
            "{currentQuote.text}"
          </p>
          <p className="text-xs font-medium mt-2 text-accent-1 tracking-wider">
            {currentQuote.reference}
          </p>
        </motion.div>
        {session?.user?.name && (
          <motion.p
            className="mt-12 text-base text-muted-foreground/80 hidden md:block"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          >
            Hey <span className="font-serif font-medium text-accent-1">{session.user.name.split(' ')[0]}</span>, ready to serve?
          </motion.p>
        )}
        <motion.div 
          className="mt-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-6 py-3 border border-accent-1/40 rounded-full shadow-sm hover:shadow-md tactile-button text-accent-1 bg-white/80 hover:bg-accent-1/10 transition-colors duration-200"
            whileHover={{ 
              scale: 1.04,
              transition: { duration: 0.18 }
            }}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-base font-medium tracking-wide text-accent-1">Explore Your Ministry Tools</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
} 