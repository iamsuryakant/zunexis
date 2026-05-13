"use client"

import { useExecutionStore } from "@/stores/useExecutionStore"
import { useTheme } from "next-themes"
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Terminal,
  Trash2,
  Cpu,
  Copy,
  Clock,
  HardDrive
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

export default function ExecutionConsole() {
  const { activeFileId, outputs, statuses, metas, clearOutput, isConsoleCollapsed, toggleConsole } = useExecutionStore()
  const { resolvedTheme } = useTheme()
  const [copied, setCopied] = useState(false)

  const outputLogs = activeFileId ? (outputs[activeFileId] || []) : []
  const status = activeFileId ? (statuses[activeFileId] || "idle") : "idle"
  const meta = activeFileId ? (metas[activeFileId]) : null

  // Theme-specific console styling - use website theme (default to dark until resolved)
  const isDarkTheme = resolvedTheme === "dark" || resolvedTheme === undefined

  const consoleBg = isDarkTheme ? "bg-zinc-900" : "bg-zinc-100"
  const consoleHeaderBg = isDarkTheme ? "bg-zinc-900/80" : "bg-zinc-200/80"
  const consoleFooterBg = isDarkTheme ? "bg-zinc-900/50" : "bg-zinc-200/50"
  const consoleText = isDarkTheme ? "text-zinc-300" : "text-zinc-700"
  const consoleMuted = isDarkTheme ? "text-zinc-500" : "text-zinc-400"

  const statusConfig = isDarkTheme
    ? {
        idle: { label: "Ready", icon: Cpu, color: "text-zinc-500", bg: "bg-zinc-800" },
        running: { icon: Loader2, label: "Running", color: "text-blue-400", bg: "bg-blue-900/30" },
        success: { icon: CheckCircle2, label: "Success", color: "text-green-500", bg: "bg-green-900/20" },
        error: { icon: XCircle, label: "Error", color: "text-red-400", bg: "bg-red-900/30" },
      }
    : {
        idle: { label: "Ready", icon: Cpu, color: "text-zinc-500", bg: "bg-zinc-200" },
        running: { icon: Loader2, label: "Running", color: "text-blue-600", bg: "bg-blue-100" },
        success: { icon: CheckCircle2, label: "Success", color: "text-green-600", bg: "bg-green-100" },
        error: { icon: XCircle, label: "Error", color: "text-red-600", bg: "bg-red-100" },
      }

  const current = statusConfig[status as keyof typeof statusConfig] || statusConfig.idle

  const handleCopy = () => {
    if (outputLogs.length > 0) {
      navigator.clipboard.writeText(outputLogs.join("\n"))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className={cn("flex flex-col h-full font-mono selection:bg-primary/30", consoleBg)}>
      {/* Terminal Header */}
      <div className={cn("h-9 flex items-center justify-between px-3 border-b", isDarkTheme ? "border-zinc-800" : "border-zinc-200", consoleHeaderBg)}>
        <div className="flex items-center gap-2">
          <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-full", current.bg)}>
            <current.icon
              size={11}
              className={cn(current.color, status === "running" && "animate-spin")}
            />
            <span className={cn("text-[9px] font-bold uppercase tracking-wide", current.color)}>
              {current.label}
            </span>
          </div>
          {status === "running" && (
            <span className={cn("text-[9px] animate-pulse", consoleMuted)}>
              Processing...
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {meta && (
            <div className={cn("flex items-center gap-2 px-2 text-[9px]", consoleMuted)}>
              {meta.time > 0 && (
                <div className="flex items-center gap-1">
                  <Clock size={9} />
                  <span>{meta.time}ms</span>
                </div>
              )}
              {meta.memory > 0 && (
                <div className="flex items-center gap-1">
                  <HardDrive size={9} />
                  <span>{(meta.memory / 1024 / 1024).toFixed(1)}MB</span>
                </div>
              )}
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="h-6 w-6 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => activeFileId && clearOutput(activeFileId)}
            className="h-6 w-6 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            <Trash2 size={12} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleConsole}
            className="h-6 w-6 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            {isConsoleCollapsed ? <Terminal size={12} className="rotate-45" /> : <Terminal size={12} className="-rotate-45" />}
          </Button>
        </div>
      </div>

      {/* Output Stream */}
      <div className="flex-1 overflow-y-auto p-3">
        <AnimatePresence mode="popLayout">
          {outputLogs.length === 0 ? (
            <div className={cn("h-full flex flex-col items-center justify-center", isDarkTheme ? "text-zinc-600" : "text-zinc-400")}>
              <Terminal size={28} strokeWidth={1} />
              <span className="text-[10px] mt-3 uppercase tracking-widest font-medium">No output</span>
              <span className="text-[9px] mt-1 opacity-50">Run code to see results here</span>
            </div>
          ) : (
            <div className="space-y-0.5">
              {outputLogs.map((log, i) => (
                <motion.div
                  key={`${activeFileId}-${i}`}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-2 text-[12px]"
                >
                  <span className={cn("text-[10px] w-5 text-right select-none shrink-0 pt-0.5", isDarkTheme ? "text-zinc-600" : "text-zinc-400")}>
                    {i + 1}
                  </span>
                  <pre className={cn(
                    "flex-1 break-all whitespace-pre-wrap leading-relaxed",
                    status === "error" && i === outputLogs.length - 1
                      ? (isDarkTheme ? "text-red-400" : "text-red-600")
                      : (isDarkTheme ? "text-zinc-300" : "text-zinc-700")
                  )}>
                    {log}
                  </pre>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className={cn("h-5 px-3 flex items-center justify-between border-t text-[9px]", isDarkTheme ? "border-zinc-800 bg-zinc-900/50 text-zinc-500" : "border-zinc-300 bg-zinc-100 text-zinc-600")}>
        <span>{outputLogs.length} line{outputLogs.length !== 1 ? "s" : ""}</span>
        <span className="uppercase tracking-wider">Output</span>
      </div>
    </div>
  )
}