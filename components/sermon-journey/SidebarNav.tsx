// components/sermon-journey/SidebarNav.tsx
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
    BookOpen,
    Feather,
    Heart,
    Lightbulb,
    Mic,
    Users,
    Flame
} from "lucide-react";

interface SidebarNavProps {
    activeTab: string;
    setActiveTab: (tabId: string) => void;
}

export const navItems = [
    { id: "journey", icon: <BookOpen className="h-5 w-5" />, label: "Journey" },
    { id: "inspiration", icon: <Lightbulb className="h-5 w-5" />, label: "Inspiration" },
    { id: "congregation", icon: <Users className="h-5 w-5" />, label: "Congregation" },
    { id: "delivery", icon: <Mic className="h-5 w-5" />, label: "Delivery" },
    { id: "reflection", icon: <Heart className="h-5 w-5" />, label: "Reflection" },
];

export function SidebarNav({ activeTab, setActiveTab }: SidebarNavProps) {
    return (
        <div className="hidden w-20 bg-gradient-to-b from-[#f9f8f6] via-[#f9f8f6]/95 to-[#f9f8f6]/90 dark:from-[#1d1a17] dark:via-[#1d1a17]/95 dark:to-[#1d1a17]/90 border-r lg:flex lg:flex-col lg:items-center lg:py-8 shadow-sm">
            <motion.div 
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent-3/40 to-accent-3/20 text-accent-1 shadow-sm border border-accent-3/40"
                whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 15px rgba(0,0,0,0.05)" 
                }}
                whileTap={{ scale: 0.98 }}
            >
                <Flame className="h-5 w-5 text-accent-1" />
            </motion.div>
            <nav className="mt-12 flex flex-col items-center gap-8">
                {navItems.map((item, index) => (
                    <motion.button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                            "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-all duration-200",
                            activeTab === item.id
                                ? "bg-gradient-to-br from-accent-3/40 to-accent-3/20 text-accent-1 dark:from-accent-3/40 dark:to-accent-3/20 dark:text-accent-1 shadow-sm"
                                : "text-muted-foreground hover:bg-accent-3/10 dark:hover:bg-accent-3/10",
                        )}
                        aria-label={item.label}
                        title={item.label}
                    >
                        {item.icon}
                    </motion.button>
                ))}
            </nav>
            
            {/* Soft gradient background effect */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-40 pointer-events-none">
                <div className="w-12 h-12 bg-gradient-radial from-accent-1/20 to-transparent rounded-full blur-xl" />
            </div>
        </div>
    );
} 