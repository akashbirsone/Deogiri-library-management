"use client"

import * as React from "react"
import {
  Book,
  LayoutDashboard,
  Users,
  Library,
  History,
  Settings,
  HelpCircle,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import { useApp } from "@/contexts/app-provider"
import { DashboardView } from "@/components/views/dashboard-view"
import { BooksView } from "@/components/views/books-view"
import { UsersView } from "@/components/views/users-view"
import { MyBooksView } from "@/components/views/my-books-view"
import { HistoryView } from "@/components/views/history-view"
import { SettingsView } from "@/components/views/settings-view"
import { HelpView } from "@/components/views/help-view"

type View = "dashboard" | "books" | "users" | "my-books" | "history" | "settings" | "help";

export default function MainPage() {
  const { role } = useApp()
  const [activeView, setActiveView] = React.useState<View>("dashboard")

  const navigationItems = [
    { name: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { name: "books", label: "Book Catalog", icon: Book },
    { name: "my-books", label: "My Books", icon: Library, roles: ["student"] },
    { name: "history", label: "History", icon: History, roles: ["student"] },
    { name: "users", label: "User Management", icon: Users, roles: ["admin", "librarian"] },
    { name: "settings", label: "Profile & Settings", icon: Settings },
    { name: "help", label: "Help & Support", icon: HelpCircle },
  ]

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardView />
      case "books":
        return <BooksView />
      case "users":
        return <UsersView />
      case "my-books":
          return <MyBooksView />
      case "history":
          return <HistoryView />
      case "settings":
          return <SettingsView />
      case "help":
            return <HelpView />
      default:
        return <DashboardView />
    }
  }

  return (
    <SidebarProvider>
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="border-sidebar-border"
      >
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navigationItems.map((item) =>
              !item.roles || item.roles.includes(role) ? (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    onClick={() => setActiveView(item.name as View)}
                    isActive={activeView === item.name}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : null
            )}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="items-center justify-center group-data-[collapsible=icon]:-ml-2">
          <ThemeToggle />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-end gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
          <UserNav />
        </header>
        <main className="flex-1 p-4 sm:p-6">{renderView()}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
