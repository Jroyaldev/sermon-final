import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card"; // Assuming Card parts are used
import { cn } from "@/lib/utils";
import type { Tool } from "@/types";

interface ToolsGridProps {
  tools: Tool[];
  containerVariants: any; // Consider defining a more specific type if needed
  itemVariants: any;      // Consider defining a more specific type if needed
}

export default function ToolsGrid({ 
  tools,
  containerVariants,
  itemVariants 
}: ToolsGridProps) {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="mb-24 md:mb-32"
    >
      <div className="grid gap-8 md:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, index) => { 
          const IconComponent = tool.icon;
          const isComingSoon = tool.status === "coming_soon";
          const isFeatured = tool.badge === "Featured";
          const isComingNext = tool.badge === "Coming Next";
          
          // Base styles - using earthy colors
          let bgColorClass = 'bg-white/40 dark:bg-black/10'; 
          let fgColorClass = 'text-foreground'; 
          let iconColorClass = 'text-accent-1'; 
          let badgeBgClass = 'bg-white/70 dark:bg-black/40'; 
          let iconBgClass = 'bg-accent-3/20 dark:bg-accent-3/10';
          let categoryText = "Ministry Tool";

          if (isFeatured) {
            bgColorClass = 'bg-card-bg-featured';
            fgColorClass = 'text-card-fg-on-featured';
            iconColorClass = 'text-accent-1'; 
            iconBgClass = 'bg-accent-3/30 dark:bg-accent-3/20';
            badgeBgClass = 'bg-white/80 dark:bg-black/50';
            categoryText = "Featured Tool";
          } else if (isComingNext) {
            bgColorClass = 'bg-card-bg-next';
            fgColorClass = 'text-card-fg-on-next';
            iconColorClass = 'text-accent-2'; 
            iconBgClass = 'bg-accent-2/10 dark:bg-accent-2/10';
            categoryText = "Coming Next";
          } else if (isComingSoon) {
            bgColorClass = (index % 2 === 0) ? 'bg-card-bg-soon-1' : 'bg-card-bg-soon-2'; 
            fgColorClass = (index % 2 === 0) ? 'text-card-fg-on-soon-1' : 'text-card-fg-on-soon-2';
            iconColorClass = (index % 2 === 0) ? 'text-accent-3/90' : 'text-accent-4/90'; 
            iconBgClass = (index % 2 === 0) ? 'bg-accent-3/20 dark:bg-accent-3/10' : 'bg-accent-4/10 dark:bg-accent-4/10';
            categoryText = "Coming Soon";
          } 

          const cardClasses = cn(
            "group relative flex flex-col h-full backdrop-blur-sm premium-card",
            bgColorClass, 
            "border-0 rounded-xl overflow-hidden", 
            isComingSoon 
              ? "opacity-80 hover:shadow-xl transition-all duration-300 ease-out" 
              : "hover:shadow-xl transition-all duration-300 ease-out transform-gpu hover:scale-[1.02] hover:-translate-y-1"
          );
          
          const mutedTextColorClass = `${fgColorClass} opacity-85`;

          const cardContent = (
            <div className="p-6 md:p-7 flex flex-col h-full"> 
              <div className="text-[10px] uppercase tracking-wider font-medium mb-5 text-foreground/50">
                {categoryText}
              </div>
              <div className="flex items-start gap-4 mb-4"> 
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBgClass} shadow-sm`}>
                  <IconComponent className={`h-5 w-5 ${iconColorClass}`} /> 
                </div>
                <h3 className={`text-lg md:text-xl font-serif font-medium leading-tight ${fgColorClass}`}> 
                  {tool.title}
                </h3>
              </div>
              <p className={`text-sm leading-relaxed flex-grow ${mutedTextColorClass} font-light`}> 
                {tool.description}
              </p>
              {!isComingSoon && (
                <div className="mt-6 flex justify-start">
                  <div className="text-xs font-medium flex items-center gap-1.5 text-accent-1/80 group-hover:text-accent-1 transition-colors">
                    <span>Open</span>
                    <span className="w-3 h-0.5 bg-accent-1/60 group-hover:w-5 group-hover:bg-accent-1 transition-all"></span>
                  </div>
                </div>
              )}
            </div>
          );

          return (
            <motion.div
              key={tool.id}
              variants={itemVariants}
              className="h-full relative" 
            >
              {tool.badge && (
                <Badge
                  variant="secondary"
                  className={cn(
                    "absolute top-5 right-5 z-10", 
                    "text-[10px] font-medium px-2.5 py-1 rounded-full border-0",
                    badgeBgClass, 
                    mutedTextColorClass 
                  )}
                >
                  {tool.badge}
                </Badge>
              )}

             {isComingSoon ? (
                <div className={cardClasses}>
                  {cardContent}
                </div>
              ) : (
                <Link 
                  href={tool.href} 
                  className={cardClasses} 
                  aria-label={`Open ${tool.title} module`}
                >
                  {cardContent}
                </Link>
             )}
            </motion.div>
          );
        })} 
      </div>
    </motion.section>
  );
} 