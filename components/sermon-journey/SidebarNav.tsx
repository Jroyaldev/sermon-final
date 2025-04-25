// components/sermon-journey/SidebarNav.tsx
import { cn } from "@/lib/utils";
import {
    BookOpen,
    Feather,
    Heart,
    Lightbulb,
    Mic,
    Users,
} from "lucide-react";

interface SidebarNavProps {
    activeTab: string;
    setActiveTab: (tabId: string) => void;
}

const navItems = [
    { id: "journey", icon: <BookOpen className="h-5 w-5" />, label: "Journey" },
    { id: "inspiration", icon: <Lightbulb className="h-5 w-5" />, label: "Inspiration" },
    { id: "congregation", icon: <Users className="h-5 w-5" />, label: "Congregation" },
    { id: "delivery", icon: <Mic className="h-5 w-5" />, label: "Delivery" },
    { id: "reflection", icon: <Heart className="h-5 w-5" />, label: "Reflection" },
];

export function SidebarNav({ activeTab, setActiveTab }: SidebarNavProps) {
    return (
        <div className="hidden w-20 bg-[#f9f8f6] dark:bg-[#1d1a17] border-r lg:flex lg:flex-col lg:items-center lg:py-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f9f7f2] dark:bg-[#272320] border border-[#e8e3d9] dark:border-[#2a2520]">
                <Feather className="h-5 w-5 text-[#3c3528] dark:text-[#e8e3d9]" />
            </div>
            <nav className="mt-12 flex flex-col items-center gap-8">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={cn(
                            "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-all duration-200",
                            activeTab === item.id
                                ? "bg-[#e8e3d9] text-[#3c3528] dark:bg-[#2a2520] dark:text-[#e8e3d9] shadow-sm"
                                : "text-muted-foreground hover:bg-background dark:hover:bg-background/10",
                        )}
                        aria-label={item.label}
                        title={item.label}
                    >
                        {item.icon}
                    </button>
                ))}
            </nav>
        </div>
    );
} 