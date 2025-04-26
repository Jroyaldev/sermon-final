import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, Menu, ChevronDown, Flame } from "lucide-react";
import { Session } from "next-auth"; // Assuming Session type is available
import { cn } from "@/lib/utils";

interface JourneyHeaderProps {
    activeTab: string;
    session: Session | null; // Pass the session object or relevant user info
}

const tabTitles: { [key: string]: string } = {
    journey: "Sermon Journey",
    inspiration: "Inspiration Garden",
    congregation: "Congregation Insights",
    delivery: "Delivery Preparation",
    reflection: "Reflection & Impact",
    series: "Manage Series" // Add title for the series tab if needed when it's active
};

export function JourneyHeader({ activeTab, session }: JourneyHeaderProps) {
    const getInitials = (name?: string | null) => {
        if (!name) return "U"; // Default fallback
        const names = name.split(' ');
        if (names.length === 1) return names[0][0].toUpperCase();
        return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
    }

    const user = session?.user;
    const userInitials = getInitials(user?.name);
    const userImage = user?.image;

    // Determine the title based on activeTab, default to "Sermon Journey" or similar
    // The main page logic might need adjustment if the active tab state is managed differently across components
    const title = tabTitles[activeTab] || "Sermon Flow"; // Fallback title

    return (
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-gradient-to-r from-[#f9f8f6] via-[#f9f8f6]/95 to-[#f9f8f6]/90 dark:from-[#1d1a17] dark:via-[#1d1a17]/95 dark:to-[#1d1a17]/90 backdrop-blur-md shadow-sm px-6">
            <div className="flex items-center gap-4">
                {/* Mobile Menu Button - Functionality might need to be added if a mobile sidebar is implemented */}
                <motion.button 
                    className="lg:hidden flex items-center justify-center rounded-full w-9 h-9 border border-border/20 hover:bg-accent-3/10 transition-all duration-200 focus:outline-none"
                    whileTap={{ scale: 0.95 }}
                    aria-label="Open menu"
                >
                    <Menu className="h-5 w-5 text-foreground/80" />
                </motion.button>
                 
                <Link href="/" className="mr-2" aria-label="Go to Dashboard">
                    <motion.div 
                        className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-accent-3/40 to-accent-3/20 text-accent-1 shadow-sm hover:shadow-md transition-all duration-300"
                        whileHover={{ 
                            scale: 1.05,
                            boxShadow: "0 0 20px rgba(0,0,0,0.05)" 
                        }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Flame className="h-5 w-5 text-accent-1" />
                    </motion.div>
                </Link>
                <h1 className="text-xl font-serif font-medium tracking-tight text-foreground">
                    {title}
                </h1>
            </div>
            <div className="flex items-center gap-4">
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Avatar className="h-8 w-8 ring-2 ring-[#e8e3d9] dark:ring-[#2a2520] ring-offset-2 ring-offset-[#f9f8f6] dark:ring-offset-[#1d1a17] shadow-sm">
                        {userImage ? (
                          <AvatarImage src={userImage} alt={user?.name || "User"} />
                        ) : null}
                        <AvatarFallback className="bg-gradient-to-br from-accent-3/30 to-accent-3/10 text-accent-1 font-serif">
                            {userInitials}
                        </AvatarFallback>
                    </Avatar>
                </motion.div>
            </div>
        </header>
    );
} 