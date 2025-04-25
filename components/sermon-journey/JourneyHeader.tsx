import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, Menu, ChevronDown } from "lucide-react";
import { Session } from "next-auth"; // Assuming Session type is available

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
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-[#f9f8f6] dark:bg-[#1d1a17] px-6">
            <div className="flex items-center gap-4">
                {/* Mobile Menu Button - Functionality might need to be added if a mobile sidebar is implemented */}
                <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                </Button>
                 <Link href="/" className="mr-2" aria-label="Go to Dashboard">
                     <Button variant="ghost" size="icon" className="rounded-full">
                        <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
                    </Button>
                 </Link>
                <h1 className="text-xl font-medium tracking-tight text-foreground">
                    {title}
                </h1>
            </div>
            <div className="flex items-center gap-4">
                {/* Date Range Button - Functionality not implemented in original */}
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 rounded-full px-4"
                >
                    April - May {/* Placeholder */}
                    <ChevronDown className="h-4 w-4" />
                </Button>
                <Avatar className="h-8 w-8 ring-2 ring-[#e8e3d9] dark:ring-[#2a2520] ring-offset-2 ring-offset-[#f9f8f6] dark:ring-offset-[#1d1a17]">
                    {userImage ? (
                      <AvatarImage src={userImage} alt={user?.name || "User"} />
                    ) : null}
                    <AvatarFallback className="bg-[#f9f7f2] text-[#3c3528] dark:bg-[#272320] dark:text-[#e8e3d9]">
                        {userInitials}
                    </AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
} 