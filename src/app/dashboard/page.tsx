
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
import { cn } from "@/lib/utils"

type View = "dashboard" | "books" | "users" | "my-books" | "history" | "settings" | "help";

const MobileNav = ({ activeView, onNavigate, onLogout }: { activeView: View; onNavigate: (view: View) => void; onLogout: () => void }) => {
    const { user } = useApp();

    const topNavItems = [
        { name: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { name: "books", label: "Book Catalog", icon: Book },
        { name: "users", label: "User Management", icon: Users, roles: ["admin", "librarian"] },
    ];
    
    const bottomNavItems = [
        { name: "settings", label: "Profile", icon: Settings },
        { name: "help", label: "Help", icon: HelpCircle },
    ];
    
    if (!user) return null;

    return (
        <>
            {/* Top Fixed Header */}
            <header className="md:hidden fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4">
                <Logo />
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Button variant="ghost" size="icon" onClick={onLogout}>
                        <LogOut className="h-5 w-5" />
                        <span className="sr-only">Logout</span>
                    </Button>
                </div>
            </header>

            {/* Bottom Fixed Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t bg-background">
                <div className="grid h-16 grid-cols-5 items-stretch">
                    {topNavItems.map(item => (
                       (!item.roles || item.roles.includes(user.role)) && (
                            <button
                                key={item.name}
                                onClick={() => onNavigate(item.name as View)}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
                                    activeView === item.name ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                <span>{item.label}</span>
                            </button>
                       )
                    ))}
                     {bottomNavItems.map(item => (
                        <button
                            key={item.name}
                            onClick={() => onNavigate(item.name as View)}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
                                activeView === item.name ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>
        </>
    );
};


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

  if (!user) {
    return null;
  }

  return (
    <>
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="hidden md:flex border-sidebar-border transition-transform duration-300 ease-in-out"
      >
        <SidebarHeader className="flex items-center justify-between p-4 border-b">
          <Logo />
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
        <header className="hidden md:flex h-14 items-center justify-between gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
            <div/>
          <div className="flex flex-1 items-center justify-end gap-4">
            <UserNav />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{renderView()}</main>
      </SidebarInset>
      <MobileNav activeView={activeView} onNavigate={handleViewChange} onLogout={logout} />
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
