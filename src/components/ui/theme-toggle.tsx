"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { SidebarMenuButton } from "./sidebar"

export function ThemeToggle() {
  const [theme, setThemeState] = React.useState<"theme-light" | "dark" | "system">("system")

  React.useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark")
    setThemeState(isDarkMode ? "dark" : "theme-light")
  }, [])

  React.useEffect(() => {
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    document.documentElement.classList[isDark ? "add" : "remove"]("dark")
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light')
    } catch (e) {}
  }, [theme])

  const toggleTheme = () => {
    setThemeState(prevTheme => prevTheme === 'dark' ? 'theme-light' : 'dark')
  }

  return (
    <SidebarMenuButton variant="ghost" onClick={toggleTheme} aria-label="Toggle theme" tooltip="Toggle Theme">
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="min-w-max">Toggle Theme</span>
    </SidebarMenuButton>
  )
}
