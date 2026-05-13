"use client"

import { useExecutionStore } from "@/stores/useExecutionStore"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ChevronUp, 
  Globe, 
  Cpu, 
  Monitor,
  Terminal
} from "lucide-react"
import { useState, useEffect } from "react"
import { LANGUAGES } from "@/lib/languages"
import { motion, AnimatePresence } from "framer-motion"

export default function StatusBar() {
  const {
    files,
    activeFileId,
    statuses,
    defaultLanguage,
    setDefaultLanguage,
    isConsoleCollapsed,
    toggleConsole,
  } = useExecutionStore()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)

  useEffect(() => setMounted(true), [])
  
  // Handle click outside to close menu
  useEffect(() => {
    if (!showLangMenu) return
    const close = () => setShowLangMenu(false)
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [showLangMenu])

  const activeFile = files.find(f => f.id === activeFileId)
  const status = activeFileId ? statuses[activeFileId] || "idle" : "idle"

  const isDark = theme === "dark"

  const statusConfig = isDark
    ? {
        idle: { label: "Ready", icon: Cpu, color: "text-muted-foreground/50" },
        running: { label: "Executing", icon: Loader2, color: "text-blue-400" },
        success: { label: "Success", icon: CheckCircle2, color: "text-green-500" },
        error: { label: "Error", icon: AlertCircle, color: "text-red-500" },
      }
    : {
        idle: { label: "Ready", icon: Cpu, color: "text-zinc-500" },
        running: { label: "Executing", icon: Loader2, color: "text-blue-600" },
        success: { label: "Success", icon: CheckCircle2, color: "text-green-600" },
        error: { label: "Error", icon: AlertCircle, color: "text-red-600" },
      }

  const currentStatus = statusConfig[status as keyof typeof statusConfig] || statusConfig.idle
  const currentLang = LANGUAGES.find(l => l.key === defaultLanguage) || LANGUAGES[0]

  if (!mounted) return <footer className="h-6 bg-background border-t border-border/40" />

  return (
    <footer className="h-6 flex items-center justify-between gap-2 px-2 md:px-3 bg-background border-t border-border/40 select-none font-sans overflow-visible">
      {/* 1. Left Section: System Status */}
      <div className="flex min-w-0 items-center gap-2 md:gap-4">
        <div className={cn("flex items-center gap-1.5 transition-colors duration-300", currentStatus.color)}>
          <currentStatus.icon size={11} className={status === "running" ? "animate-spin" : ""} />
          <span className="text-[9px] font-semibold uppercase tracking-wide hidden sm:inline">{currentStatus.label}</span>
        </div>

        {activeFile && (
          <div className={cn("flex items-center gap-2", isDark ? "text-muted-foreground/40" : "text-zinc-500")}>
            <div className={cn("w-px h-3 hidden sm:block", isDark ? "bg-border/60" : "bg-zinc-300")} />
            <span className="text-[10px] font-medium truncate max-w-20 md:max-w-30">{activeFile.name}</span>
          </div>
        )}
      </div>

      {/* 2. Right Section: Environment Info */}
      <div className="flex shrink-0 items-center gap-2 md:gap-4">
        <button
          onClick={toggleConsole}
          title={isConsoleCollapsed ? "Show console" : "Hide console"}
          className={cn(
            "flex h-5 items-center gap-1 rounded-md px-1.5 text-[10px] font-semibold uppercase tracking-normal transition-colors",
            isConsoleCollapsed
              ? "bg-primary/10 text-primary hover:bg-primary/15"
              : isDark
                ? "text-muted-foreground/60 hover:bg-muted hover:text-foreground"
                : "text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900"
          )}
        >
          <Terminal size={10} />
          <span className="hidden sm:inline">{isConsoleCollapsed ? "Show Console" : "Console"}</span>
        </button>

        {/* Language Selector */}
        <div className="relative h-full flex items-center">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowLangMenu(!showLangMenu)
            }}
            className={cn(
              "flex items-center gap-1 md:gap-2 h-5 px-1.5 md:px-2 rounded-md transition-all text-[10px] font-semibold tracking-normal",
              showLangMenu
                ? "bg-primary text-primary-foreground shadow-lg"
                : isDark
                  ? "text-muted-foreground/60 hover:bg-muted hover:text-foreground"
                  : "text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900"
            )}
          >
            <Globe size={10} className="hidden sm:inline" />
            <span className="uppercase">{currentLang.label}</span>
            <ChevronUp size={9} className={cn("transition-transform", showLangMenu && "rotate-180")} />
          </button>

          <AnimatePresence>
            {showLangMenu && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                className="absolute bottom-[140%] right-0 mb-1 w-36 md:w-40 py-1 bg-popover border border-border rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.3)] z-100 max-h-48 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3 py-1 mb-1 border-b border-border/50">
                  <span className="text-[9px] font-semibold text-muted-foreground/45 uppercase tracking-[0.12em]">Environment</span>
                </div>
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.key}
                    onClick={() => {
                      setDefaultLanguage(lang.key)
                      setShowLangMenu(false)
                    }}
                    className={cn(
                      "w-full px-3 py-1.5 text-left text-[11px] font-medium transition-colors",
                      lang.key === defaultLanguage
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {lang.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Indicator */}
        <div className={cn("flex items-center gap-1.5", isDark ? "text-muted-foreground/40" : "text-zinc-400")}>
          <div className={cn("w-px h-3 hidden sm:block", isDark ? "bg-border/60" : "bg-zinc-300")} />
          <Monitor size={11} className="hidden sm:inline" />
          <span className="uppercase text-[9px] font-semibold tracking-wide hidden md:inline">{theme}</span>
        </div>
      </div>
    </footer>
  )
}
