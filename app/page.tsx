"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen,
  Calendar,
  Compass,
  FileText,
  Heart,
  Library,
  Users,
  Sparkles,
  Menu,
  Clock,
  BookMarked,
  Flame,
  Sun,
  ChevronDown,
  LogOut
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import LoginButton from "@/components/LoginButton"

// Define Tool type including optional badge
type Tool = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  badge?: "Coming Soon" | "Coming Next" | "Featured";
  status?: "active" | "coming_soon";
};

// Scripture quotes that rotate
const scriptureQuotes = [
  { text: "Let the elders who rule well be considered worthy of double honor...", reference: "1 Timothy 5:17" },
  { text: "Preach the word; be ready in season and out of season...", reference: "2 Timothy 4:2" },
  { text: "Feed my sheep.", reference: "John 21:17" },
  { text: "For they watch over your souls, as those who will give an account.", reference: "Hebrews 13:17" },
  { text: "Not domineering over those in your charge, but being examples to the flock.", reference: "1 Peter 5:3" }
];

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentQuote, setCurrentQuote] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showHeroContent, setShowHeroContent] = useState(true);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Rotate through scripture quotes
  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % scriptureQuotes.length);
    }, 8000);
    
    return () => clearInterval(quoteTimer);
  }, []);

  // Timer to hide hero content and show enhanced date/time after about 1 minute
  useEffect(() => {
    const heroTimer = setTimeout(() => {
      setShowHeroContent(false);
    }, 10000); // Speed up for testing
    
    return () => clearTimeout(heroTimer);
  }, []);
  
  // Format date and time
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).format(currentTime);
  
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(currentTime);

  // Generate a thoughtful greeting based on time of day
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Ready to shepherd this morning?";
    if (hour < 17) return "It's a good day to shepherd well.";
    return "Evening reflections await you.";
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Define tools data with updated structure and icons
  const tools: Tool[] = [
    {
      id: "sermon-journey",
      title: "Sermon Journey",
      description: "Plan, develop, and refine your sermons step-by-step.",
      icon: BookOpen,
      href: "/sermon-journey",
      badge: "Featured",
      status: "active",
    },
    {
      id: "church-crm",
      title: "Member Connect",
      description: "Manage contacts and nurture community relationships.",
      icon: Users,
      href: "/church-crm",
      badge: "Coming Next",
      status: "coming_soon",
    },
    {
      id: "events",
      title: "Events Calendar",
      description: "Organize church events, manage volunteers, and track attendance.",
      icon: Calendar,
      href: "/events",
      badge: "Coming Soon",
      status: "coming_soon",
    },
    {
      id: "resource-library",
      title: "Resource Library",
      description: "Access sermon illustrations, research materials, and templates.",
      icon: Library,
      href: "/resources",
      badge: "Coming Soon",
      status: "coming_soon",
    },
    {
      id: "community",
      title: "Community Engagement",
      description: "Plan outreach initiatives and measure their impact.",
      icon: Heart,
      href: "/community",
      badge: "Coming Soon",
      status: "coming_soon",
    },
    {
      id: "discipleship",
      title: "Discipleship Pathways",
      description: "Design personalized spiritual growth plans and track progress.",
      icon: Compass,
      href: "/discipleship",
      badge: "Coming Soon",
      status: "coming_soon",
    },
  ]

  // Loading state - extremely minimal
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-1.5 w-16 bg-primary/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary/80 rounded-full" 
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: 1.2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        </div>
      </div>
    );
  }

  // Animation variants - subtle
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

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  // Floating ministerial symbols animation
  const symbolVariants = {
    animate: {
      y: [0, -10, 0],
      opacity: [0.3, 0.6, 0.3],
      transition: {
        y: { repeat: Infinity, duration: 8, ease: "easeInOut" },
        opacity: { repeat: Infinity, duration: 8, ease: "easeInOut" }
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background via-background/95 to-background/90 selection:bg-primary/5 selection:text-primary flex flex-col">
      {/* Soft radial background gradients */}
      <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-gradient-to-br from-accent-1/5 via-accent-3/5 to-transparent rounded-full opacity-70 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-accent-2/5 via-accent-4/5 to-transparent rounded-full opacity-60 blur-[100px]" />
      </div>

      {/* Enhanced Premium App-like Header with Ministerial Aesthetics */}
      <header className="sticky top-0 z-50 w-full shadow-sm backdrop-blur-xl border-b border-border/10 transition-all duration-300">
        <div className="flex items-center justify-between h-16 md:h-18 px-4 sm:px-6 md:px-10 lg:px-16 max-w-screen-xl mx-auto w-full">
          {/* Left: Logo & Mobile Menu with Enhanced Typography */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <motion.button 
              className="lg:hidden flex items-center justify-center rounded-full w-9 h-9 border border-border/20 hover:bg-accent-3/10 transition-all duration-200 focus:outline-none tactile-button" 
              aria-label="Open menu"
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="w-5 h-5 text-foreground/80" />
            </motion.button>
            
            {/* Logo/Brand with Ministerial Feel */}
            <Link href="/" className="flex items-center gap-3 group" aria-label="Go to Dashboard">
              <motion.div 
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-accent-3/40 to-accent-3/20 text-accent-1 shadow-sm group-hover:shadow-md transition-all duration-300"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(0,0,0,0.05)" 
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Flame className="w-5 h-5 text-accent-1" />
              </motion.div>
              <div className="hidden sm:flex flex-col">
                <span className="text-lg font-serif text-foreground tracking-tight group-hover:text-accent-1 transition-colors duration-200 leading-tight">
                  Ministry Suite
                </span>
                <span className="text-[10px] text-muted-foreground/70 tracking-wider uppercase font-light">
                  Built by pastors, for pastors
                </span>
              </div>
            </Link>
          </div>
          
          {/* Right: Time, Account and Greeting with Ministerial Copy */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden md:flex flex-col items-center">
              <span className="text-sm font-light italic text-foreground/70">{getGreeting()}</span>
              <div className="flex items-center justify-center gap-2 text-muted-foreground/80">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs font-light tracking-wide">{formattedTime}</span>
              </div>
            </div>
            
            {/* Enhanced account/profile section */}
            {session?.user?.name && (
              <div className="relative">
                <motion.button 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-3/10 hover:bg-accent-3/20 border border-accent-3/20 transition-all duration-200"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-7 h-7 rounded-full bg-accent-1/15 flex items-center justify-center text-accent-1 font-serif">
                    {session.user.name.charAt(0)}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-foreground">{session.user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-4 h-4 text-foreground/50" />
                </motion.button>
                
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div 
                      className="absolute right-0 mt-2 w-48 rounded-xl bg-background/95 backdrop-blur-lg border border-border shadow-lg overflow-hidden"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="p-3 border-b border-border/50">
                        <p className="text-xs font-medium text-foreground/70">Signed in as</p>
                        <p className="text-sm font-medium truncate">{session.user.name}</p>
                      </div>
                      <div className="p-1">
                        <button 
                          className="w-full text-left px-3 py-2 text-sm text-destructive/80 hover:bg-destructive/10 rounded-md flex items-center gap-2 transition-colors"
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
            )}
            
            {!session?.user?.name && <LoginButton />}
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section with Ministerial Elements */}
      <main className="relative isolate flex-1 w-full pt-16 md:pt-24 pb-16 md:pb-24 lg:pb-28 overflow-hidden">
        {/* Floating ministerial symbols */}
        <div className="absolute inset-x-0 top-32 md:top-48 h-full pointer-events-none overflow-hidden flex justify-between px-20 opacity-30">
          <motion.div 
            className="w-12 h-12 text-foreground/20"
            variants={symbolVariants}
            animate="animate"
            custom={0}
          >
            <BookMarked className="w-full h-full" />
          </motion.div>
          <motion.div 
            className="w-12 h-12 text-foreground/20"
            variants={symbolVariants}
            animate="animate"
            custom={1}
            style={{ animationDelay: "2s" }}
          >
            <Flame className="w-full h-full" />
          </motion.div>
          <motion.div 
            className="w-12 h-12 text-foreground/20"
            variants={symbolVariants}
            animate="animate"
            custom={2}
            style={{ animationDelay: "4s" }}
          >
            <Heart className="w-full h-full" />
          </motion.div>
        </div>

        <div className="max-w-screen-xl mx-auto w-full px-4 sm:px-6 md:px-10 lg:px-16">
          {/* Welcome Section - Enhanced Premium Aesthetics with Ministerial Typography */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mb-20 md:mb-32 lg:mb-36 relative flex flex-col items-center text-center"
          >
            {/* Date/Time Display with premium serif typography */}
            <AnimatePresence mode="wait">
              {showHeroContent ? (
                <>
                  <motion.div 
                    className="mb-8 md:mb-10"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  >
                    <div className="flex flex-col items-center gap-1 md:gap-3">
                      <h2 className="text-lg sm:text-xl font-serif text-foreground/80 tracking-tight">
                        {formattedDate}
                      </h2>
                      <div className="flex items-center justify-center gap-2 md:mt-0">
                        <span className="inline-block w-1 h-1 rounded-full bg-foreground/30" />
                        <span className="text-base font-light text-foreground/60 tracking-wide">
                          {formattedTime}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Premium hero content with improved ministerial typography */}
                  <motion.div 
                    className="relative z-10 max-w-2xl"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 1.8, ease: "easeInOut" }}
                  >
                    {/* Small decorative accent */}
                    <motion.div 
                      className="w-16 h-0.5 bg-gradient-to-r from-accent-1/80 to-accent-1/40 rounded-full mb-6 mx-auto"
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 64, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.8 }}
                    />
                    
                    {/* Enhanced heading with confident serif typography */}
                    <motion.h1 
                      className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-[1.05] tracking-tighter mb-4"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                    >
                      Ministry begins here.
                    </motion.h1>
                    
                    {/* Refined subtitle with better typography */}
                    <motion.p 
                      className="text-base sm:text-lg text-muted-foreground/90 mt-2 font-light leading-relaxed tracking-wide max-w-lg mx-auto"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    > 
                      Tools to shepherd, teach, and lead—without the noise.
                    </motion.p>
                    
                    {/* Scripture quote that rotates */}
                    <motion.div
                      className="relative h-20 mt-8 overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentQuote}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5 }}
                          className="absolute inset-0 flex flex-col items-center justify-center"
                        >
                          <p className="text-sm italic text-foreground/70 max-w-md">
                            "{scriptureQuotes[currentQuote].text}"
                          </p>
                          <p className="text-xs font-medium mt-1 text-accent-1">
                            {scriptureQuotes[currentQuote].reference}
                          </p>
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>
                    
                    {/* User greeting with refined styling */}
                    {session?.user?.name && (
                      <motion.p
                        className="mt-8 text-xl font-light hidden md:block"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                      >
                        Hey <span className="font-serif font-medium text-accent-1">{session.user.name.split(' ')[0]}</span>, ready to serve?
                      </motion.p>
                    )}
                    
                    {/* Improved CTA with 3D tactile styling */}
                    <motion.div 
                      className="mt-10 md:mt-12"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
                    >
                      <motion.div 
                        className="inline-flex items-center gap-2.5 px-5 py-3 bg-gradient-to-r from-accent-3/40 to-accent-3/20 rounded-full border border-accent-3/40 shadow-sm hover:shadow-md tactile-button"
                        whileHover={{ 
                          scale: 1.03,
                          transition: { duration: 0.2 }
                        }}
                      >
                        <Sparkles className="w-4 h-4 text-accent-1/90" />
                        <span className="text-sm font-medium tracking-wide text-foreground/90">Explore Your Ministry Tools</span>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </>
              ) : (
                <motion.div 
                  className="py-12 md:py-16 flex flex-col items-center justify-center"
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
              )}
            </AnimatePresence>
          </motion.section>

          {/* Core Modules Section with Improved Card Design */}
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
                     {/* Category Label */}
                     <div className="text-[10px] uppercase tracking-wider font-medium mb-5 text-foreground/50">
                       {categoryText}
                     </div>
                     
                     {/* Icon and Title with better layout */}
                     <div className="flex items-start gap-4 mb-4"> 
                       <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBgClass} shadow-sm`}>
                         <IconComponent className={`h-5 w-5 ${iconColorClass}`} /> 
                       </div>
                       <h3 className={`text-lg md:text-xl font-serif font-medium leading-tight ${fgColorClass}`}> 
                         {tool.title}
                       </h3>
                     </div>
                     
                     {/* Description with improved typography */}
                     <p className={`text-sm leading-relaxed flex-grow ${mutedTextColorClass} font-light`}> 
                       {tool.description}
                     </p>
                     
                     {/* Action indicator */}
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

          {/* Quick Actions Section with Enhanced Styling */}
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
        </div>
      </main>
    </div>
  );
}

