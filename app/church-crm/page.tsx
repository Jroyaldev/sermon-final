"use client"

import Link from "next/link"
import { LayoutDashboard, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ChurchCRM() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-[#f9f8f6] dark:bg-[#1d1a17] px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="mr-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
            </Button>
          </Link>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f9f7f2] dark:bg-[#272320] border border-[#e8e3d9] dark:border-[#2a2520]">
            <Users className="h-5 w-5 text-[#3c3528] dark:text-[#e8e3d9]" />
          </div>
          <h1 className="text-xl font-medium tracking-tight text-foreground">
            Member Connect
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="h-8 w-8 ring-2 ring-[#e8e3d9] dark:ring-[#2a2520] ring-offset-2 ring-offset-[#f9f8f6] dark:ring-offset-[#1d1a17]">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback className="bg-[#f9f7f2] text-[#3c3528] dark:bg-[#272320] dark:text-[#e8e3d9]">
              JP
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="flex-1 p-8">
        <section className="mb-12">
          <h1 className="text-3xl font-medium tracking-tight text-foreground">
            Member Connect
          </h1>
          <p className="mt-2 text-muted-foreground max-w-3xl">
            Manage your congregation relationships, track member engagement, and nurture community connections.
          </p>
        </section>

        <Card premium className="max-w-3xl mx-auto mt-12 flex flex-col items-center justify-center p-12 text-center border-[#e8e3d9] dark:border-[#2a2520]">
          <CardHeader>
            <CardTitle className="text-xl">Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We're currently building this feature to help you better connect with your congregation. 
              Check back soon for updates!
            </p>
            <div className="mt-8">
              <Link href="/">
                <Button className="rounded-full bg-[#e8e3d9] text-[#3c3528] hover:bg-[#dfd8ca] dark:bg-[#2a2520] dark:text-[#e8e3d9] dark:hover:bg-[#373029]">
                  Return to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t bg-[#f9f8f6] dark:bg-[#1d1a17] py-6 px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © 2024 Ministry Suite. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
} 