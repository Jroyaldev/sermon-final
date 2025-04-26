import {
  BookOpen,
  Calendar,
  Compass,
  FileText,
  Heart,
  Library,
  Users,
} from "lucide-react";
import type { Tool } from "@/types"; // Import the Tool type

// Scripture quotes that rotate
export const scriptureQuotes = [
  { text: "Let the elders who rule well be considered worthy of double honor...", reference: "1 Timothy 5:17" },
  { text: "Preach the word; be ready in season and out of season...", reference: "2 Timothy 4:2" },
  { text: "Feed my sheep.", reference: "John 21:17" },
  { text: "For they watch over your souls, as those who will give an account.", reference: "Hebrews 13:17" },
  { text: "Not domineering over those in your charge, but being examples to the flock.", reference: "1 Peter 5:3" }
];

// Define tools data with updated structure and icons
export const tools: Tool[] = [
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