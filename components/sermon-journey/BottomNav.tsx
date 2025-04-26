import React from "react";
import { navItems } from "./SidebarNav";

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
}

export function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex justify-around items-center h-16 bg-white/95 dark:bg-[#1d1a17]/95 border-t border-border/10 shadow-t md:hidden">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex flex-col items-center justify-center px-2 py-1 transition-colors duration-150 focus:outline-none ${
            activeTab === item.id
              ? "text-accent-1 font-semibold"
              : "text-muted-foreground hover:text-accent-1"
          }`}
          aria-label={item.label}
        >
          {item.icon}
          <span className="text-[11px] mt-0.5 font-medium tracking-wide">
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
} 