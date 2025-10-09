
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
  LogOut,
  X,
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
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { UserNav } from "@/components/user-nav"
import { useApp } from "@/contexts/app-provider"
import { DashboardView } from "@/components/views/dashboard-view"
import { BooksView } from "@/components/views/books-view"
import { UsersView } from "@/components/views/users-view"
import { MyBooksView } from "@/components/views/my-books-view"
import { HistoryView } from "@/components/views/history-view"
import { SettingsView } from "@/components/views/settings-view"
import { HelpView } from "@/components/views/help-view"
import { Button } from "@/components/ui/button"

type View = "dashboard" | "books" | "users" | "my-books" | "history" | "settings" | "help";

function PageContent() {
  const { user, logout } = useApp()
  const { setOpenMobile } = useSidebar();
  const [activeView, setActiveView] = React.useState<View>("dashboard")

  const navigationItems = [
    { name: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { name: "books", label: "Book Catalog", icon: Book },
    { name: "my-books", label: "My Books", icon: Library, roles: ["student"] },
    { name: "history", label: "History", icon: History, roles: ["student"] },
    { name: "users", label: "User Management", icon: Users, roles: ["admin", "librarian"] },
  ]
  
  const bottomNavigationItems = [
    { name: "settings", label: "Profile & Settings", icon: Settings },
    { name: "help", label: "Help & Support", icon: HelpCircle },
  ]

  const handleViewChange = (view: View) => {
    setActiveView(view);
    setOpenMobile(false); // Close sidebar on mobile after selection
  }

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
    <>
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="border-sidebar-border transition-transform duration-300 ease-in-out"
      >
        <SidebarHeader className="flex items-center justify-between p-4 border-b">
          <Logo />
          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-foreground/70 hover:text-sidebar-foreground md:hidden"
            onClick={() => setOpenMobile(false)}
            aria-label="Close sidebar"
          >
            <X />
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navigationItems.map((item) =>
              !item.roles || item.roles.includes(user.role) ? (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    onClick={() => handleViewChange(item.name as View)}
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
        <SidebarFooter>
          <SidebarMenu>
             {bottomNavigationItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                        onClick={() => handleViewChange(item.name as View)}
                        isActive={activeView === item.name}
                        tooltip={item.label}
                    >
                        <item.icon />
                        <span>{item.label}</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
            <SidebarSeparator />
            <SidebarMenuItem>
                <ThemeToggle />
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton tooltip="Logout" onClick={logout}>
                    <LogOut />
                    <span>Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
            <SidebarTrigger className="md:hidden" />
          <div className="flex flex-1 items-center justify-end gap-4">
            <UserNav />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{renderView()}</main>
      </SidebarInset>
    </>
  )
}

export default function DashboardPage() {
    return (
        <SidebarProvider>
            <PageContent />
        </SidebarProvider>
    )
}
