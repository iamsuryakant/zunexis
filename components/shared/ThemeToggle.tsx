"use client"

import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
        setMounted(true)
    }, 200)

    return () => clearTimeout(timeout);
  }, [])

  if (!mounted) {
    return (
      <Button variant="secondary" size="icon" disabled>
        <span className="h-4 w-4" />
      </Button>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative transition-all duration-300 hover:scale-105"
    >
      <Sun
        className={cn(
          "h-4 w-4 absolute transition-all duration-300",
          isDark ? "rotate-90 scale-0" : "rotate-0 scale-100"
        )}
      />
      <Moon
        className={cn(
          "h-4 w-4 absolute transition-all duration-300",
          isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0"
        )}
      />
    </Button>
  )
}