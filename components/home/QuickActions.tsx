import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface QuickActionsProps {
  containerVariants: any; // Consider defining a more specific type
  itemVariants: any;      // Consider defining a more specific type
}

export default function QuickActions({ 
  containerVariants,
  itemVariants 
}: QuickActionsProps) {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h2
        variants={itemVariants}
        className="text-xs font-serif tracking-wider text-muted-foreground mb-8 uppercase text-center"
      >
        Quick Actions
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <motion.div variants={itemVariants}>
          <Link 
            href="/sermon-journey?new=true"
            className="block w-full py-4 px-5 border border-accent-3/30 bg-gradient-to-r from-accent-3/30 to-transparent rounded-xl text-center text-foreground hover:border-accent-3/50 hover:shadow-md hover:text-accent-1 font-medium tracking-tight transition-all duration-200 ease-out tactile-button"
          >
            Start new sermon
          </Link>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <div className="block w-full py-4 px-5 border border-border/30 rounded-xl text-center text-foreground/50 opacity-70">
            Log member check-in
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <div className="block w-full py-4 px-5 border border-border/30 rounded-xl text-center text-foreground/50 opacity-70">
            Schedule new event
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
} 