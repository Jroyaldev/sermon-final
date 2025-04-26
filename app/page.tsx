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
import AppHeader from "@/components/home/AppHeader"
import HeroContent from "@/components/home/HeroContent"
import DateTimeView from "@/components/home/DateTimeView"
import ToolsGrid from "@/components/home/ToolsGrid"
import QuickActions from "@/components/home/QuickActions"
import { useDateTimeGreeting } from "@/hooks/useDateTimeGreeting"
import { useScriptureQuote } from "@/hooks/useScriptureQuote"
import LoadingIndicator from "@/components/home/LoadingIndicator"

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
  const { formattedDate, formattedTime, greeting } = useDateTimeGreeting();
  const { currentQuote } = useScriptureQuote();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showHeroContent, setShowHeroContent] = useState(true);

  // Timer to hide hero content
  useEffect(() => {
    const heroTimer = setTimeout(() => {
      setShowHeroContent(false);
    }, 10000);
    
    return () => clearTimeout(heroTimer);
  }, []);
  
  // Redirect unauthenticated users
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Loading state
  if (status === 'loading') {
    return <LoadingIndicator />;
  }

  // Animation variants - Needed by ToolsGrid and QuickActions
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

  // Floating ministerial symbols animation - Keep for symbols in main layout
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

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background via-background/95 to-background/90 selection:bg-primary/5 selection:text-primary flex flex-col">
      {/* Soft radial background gradients */}
      <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-gradient-to-br from-accent-1/5 via-accent-3/5 to-transparent rounded-full opacity-70 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-accent-2/5 via-accent-4/5 to-transparent rounded-full opacity-60 blur-[100px]" />
      </div>

      <AppHeader
        session={session}
        status={status}
        formattedTime={formattedTime}
        greeting={greeting}
        showUserMenu={showUserMenu}
        setShowUserMenu={setShowUserMenu}
      />

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
                <HeroContent
                  key="hero"
                  session={session}
                  formattedDate={formattedDate}
                  formattedTime={formattedTime}
                  currentQuote={currentQuote}
                />
              ) : (
                <DateTimeView
                  key="datetime"
                  session={session}
                  formattedDate={formattedDate}
                  formattedTime={formattedTime}
                  greeting={greeting}
                />
              )}
            </AnimatePresence>
          </motion.section>

          <ToolsGrid
            tools={tools}
            containerVariants={containerVariants}
            itemVariants={itemVariants}
          />

          {/* Use QuickActions Component */}
          <QuickActions 
            containerVariants={containerVariants} 
            itemVariants={itemVariants}
          />
        </div>
      </main>
    </div>
  );
}

