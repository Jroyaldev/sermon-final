"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { 
  BookOpen, 
  Calendar, 
  ChevronRight, 
  Compass, 
  FileText, 
  GraduationCap, 
  Heart, 
  LayoutDashboard, 
  Library, 
  Lightbulb, 
  MessageCircle, 
  Mic, 
  PenTool, 
  Settings, 
  Users, 
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import LoginButton from "@/components/LoginButton"

export default function HomePage() {
  const [hoverCard, setHoverCard] = useState<string | null>(null)
  const { data: session, status } = useSession()
  const router = useRouter()
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin'); 
    }
  }, [status, router]);

  const tools = [
    {
      id: "sermon-journey",
      title: "Sermon Journey",
      description: "Plan, develop, and refine your sermons with integrated resources and inspiration.",
      icon: <BookOpen className="h-5 w-5" />,
      href: "/sermon-journey",
      highlight: true,
      color: "bg-[#f9f7f2] dark:bg-[#272320]",
      borderColor: "border-[#e8e3d9] dark:border-[#2a2520]",
      textColor: "text-[#3c3528] dark:text-[#e8e3d9]",
    },
    {
      id: "church-crm",
      title: "Member Connect",
      description: "Manage contacts, track engagement, and nurture relationships within your congregation.",
      icon: <Users className="h-5 w-5" />,
      href: "/church-crm",
      color: "bg-[#f9f7f2] dark:bg-[#272320]",
      borderColor: "border-[#e8e3d9] dark:border-[#2a2520]",
      textColor: "text-[#3c3528] dark:text-[#e8e3d9]",
    },
    {
      id: "events",
      title: "Events Calendar",
      description: "Organize church events, manage volunteers, and coordinate service planning.",
      icon: <Calendar className="h-5 w-5" />,
      href: "/events",
      color: "bg-[#f9f7f2] dark:bg-[#272320]",
      borderColor: "border-[#e8e3d9] dark:border-[#2a2520]",
      textColor: "text-[#3c3528] dark:text-[#e8e3d9]",
    },
    {
      id: "resource-library",
      title: "Resource Library",
      description: "Access and organize sermon illustrations, research, and theological resources.",
      icon: <Library className="h-5 w-5" />,
      href: "/resources",
      color: "bg-[#f9f7f2] dark:bg-[#272320]",
      borderColor: "border-[#e8e3d9] dark:border-[#2a2520]",
      textColor: "text-[#3c3528] dark:text-[#e8e3d9]",
    },
    {
      id: "community",
      title: "Community Engagement",
      description: "Manage outreach initiatives and track community impact and needs.",
      icon: <Heart className="h-5 w-5" />,
      href: "/community",
      color: "bg-[#f9f7f2] dark:bg-[#272320]",
      borderColor: "border-[#e8e3d9] dark:border-[#2a2520]",
      textColor: "text-[#3c3528] dark:text-[#e8e3d9]",
    },
    {
      id: "discipleship",
      title: "Discipleship Pathways",
      description: "Design and track spiritual growth journeys for your congregation.",
      icon: <Compass className="h-5 w-5" />,
      href: "/discipleship",
      color: "bg-[#f9f7f2] dark:bg-[#272320]",
      borderColor: "border-[#e8e3d9] dark:border-[#2a2520]",
      textColor: "text-[#3c3528] dark:text-[#e8e3d9]",
    },
  ]
  
  if (status === 'loading' || status === 'unauthenticated') {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <p>Loading...</p>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-[#f9f8f6] dark:bg-[#1d1a17] px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f9f7f2] dark:bg-[#272320] border border-[#e8e3d9] dark:border-[#2a2520]">
            <PenTool className="h-5 w-5 text-[#3c3528] dark:text-[#e8e3d9]" />
          </div>
          <h1 className="text-xl font-medium tracking-tight text-foreground">
            Ministry Suite
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <LoginButton />
        </div>
      </header>

      <main className="flex-1 p-8">
        {/* Welcome section */}
        <section className="mb-12">
          <h1 className="text-3xl font-medium tracking-tight text-foreground">
            Welcome back, {session?.user?.name ?? session?.user?.email}!
          </h1>
          <p className="mt-2 text-muted-foreground max-w-3xl">
            An integrated collection of tools designed to help you build, nurture, and grow your ministry. 
            Select a module below to get started.
          </p>
        </section>

        {/* Tools grid */}
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link 
              href={tool.href} 
              key={tool.id}
              className="transition-all duration-200"
              onMouseEnter={() => setHoverCard(tool.id)}
              onMouseLeave={() => setHoverCard(null)}
            >
              <Card 
                premium 
                className={cn(
                  "relative h-full overflow-hidden transition-all duration-200",
                  tool.borderColor,
                  hoverCard === tool.id && "translate-y-[-4px] shadow-[0_8px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.25)]"
                )}
              >
                {tool.highlight && (
                  <div className="absolute top-0 right-0 bg-[#e8e3d9] dark:bg-[#2a2520] px-3 py-1 text-xs font-medium text-[#3c3528] dark:text-[#e8e3d9] rounded-bl-lg">
                    Featured
                  </div>
                )}
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className={cn(
                    "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full",
                    "bg-[#f9f7f2] dark:bg-[#272320] border border-[#e8e3d9] dark:border-[#2a2520]"
                  )}>
                    {tool.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg font-medium">{tool.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-muted-foreground mt-2">
                    {tool.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="pt-0 flex justify-end">
                  <div className={cn(
                    "text-xs font-medium flex items-center",
                    "text-[#3c3528] dark:text-[#e8e3d9]"
                  )}>
                    Open {tool.title}
                    <ChevronRight className="ml-1 h-3 w-3" />
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </section>

        {/* Quick actions */}
        <section className="mt-12">
          <h2 className="text-xl font-medium tracking-tight text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/sermon-journey?new=true">
              <Button 
                variant="outline" 
                className="h-auto w-full py-4 px-5 justify-start border-[#e8e3d9] dark:border-[#2a2520] text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#f9f7f2] dark:bg-[#272320] mt-0.5">
                    <FileText className="h-4 w-4 text-[#3c3528] dark:text-[#e8e3d9]" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground mb-1">Start new sermon</div>
                    <div className="text-xs text-muted-foreground">Plan your next message</div>
                  </div>
                </div>
              </Button>
            </Link>
            <Link href="/church-crm">
              <Button 
                variant="outline" 
                className="h-auto w-full py-4 px-5 justify-start border-[#e8e3d9] dark:border-[#2a2520] text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#f9f7f2] dark:bg-[#272320] mt-0.5">
                    <MessageCircle className="h-4 w-4 text-[#3c3528] dark:text-[#e8e3d9]" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground mb-1">Member check-in</div>
                    <div className="text-xs text-muted-foreground">Log congregation interactions</div>
                  </div>
                </div>
              </Button>
            </Link>
            <Link href="/events">
              <Button 
                variant="outline" 
                className="h-auto w-full py-4 px-5 justify-start border-[#e8e3d9] dark:border-[#2a2520] text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#f9f7f2] dark:bg-[#272320] mt-0.5">
                    <Calendar className="h-4 w-4 text-[#3c3528] dark:text-[#e8e3d9]" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground mb-1">Schedule event</div>
                    <div className="text-xs text-muted-foreground">Add to church calendar</div>
                  </div>
                </div>
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t bg-[#f9f8f6] dark:bg-[#1d1a17] py-6 px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © 2024 Ministry Suite. All rights reserved.
          </div>
          <div className="flex gap-6">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </button>
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </button>
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Help Center
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
