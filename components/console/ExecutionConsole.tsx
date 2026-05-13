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
  HardDrive,
  History,
  Maximize2,
  Minimize2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

export default function ExecutionConsole() {
  const {
    activeFileId,
    outputs,
    statuses,
    metas,
    runHistory,
    clearOutput,
    clearRunHistory,
    isConsoleCollapsed,
    toggleConsole,
    isConsoleExpanded,
    toggleConsoleExpanded,
  } = useExecutionStore()
  const { resolvedTheme } = useTheme()
  const [copied, setCopied] = useState(false)
  const [activePanel, setActivePanel] = useState<"output" | "history">("output")

  const outputLogs = activeFileId ? (outputs[activeFileId] || []) : []
  const status = activeFileId ? (statuses[activeFileId] || "idle") : "idle"
  const meta = activeFileId ? (metas[activeFileId]) : null

  // Theme-specific console styling - use website theme (default to dark until resolved)
  const isDarkTheme = resolvedTheme === "dark" || resolvedTheme === undefined

  const consoleBg = isDarkTheme ? "bg-zinc-900" : "bg-zinc-100"
  const consoleHeaderBg = isDarkTheme ? "bg-zinc-900/80" : "bg-zinc-200/80"
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
  const activeHistory = activeFileId
    ? runHistory.filter((entry) => entry.fileId === activeFileId)
    : runHistory
  const visibleHistory = activeHistory.length > 0 ? activeHistory : runHistory

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
      <div className={cn("h-10 sm:h-9 flex items-center justify-between gap-2 px-2 sm:px-3 border-b", isDarkTheme ? "border-zinc-800" : "border-zinc-200", consoleHeaderBg)}>
        <div className="flex min-w-0 items-center gap-1.5">
          <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-full", current.bg)}>
            <current.icon
              size={11}
              className={cn(current.color, status === "running" && "animate-spin")}
            />
            <span className={cn("text-[9px] font-semibold uppercase tracking-normal", current.color)}>
              {current.label}
            </span>
          </div>
          {status === "running" && (
            <span className={cn("text-[9px] animate-pulse", consoleMuted)}>
              <span className="hidden sm:inline">Processing...</span>
            </span>
          )}
          <div className={cn("ml-1 flex items-center rounded-md border p-0.5", isDarkTheme ? "border-zinc-800 bg-zinc-950/40" : "border-zinc-300 bg-zinc-200/40")}>
            <PanelTab
              active={activePanel === "output"}
              onClick={() => setActivePanel("output")}
              label="Output"
              isDarkTheme={isDarkTheme}
            />
            <PanelTab
              active={activePanel === "history"}
              onClick={() => setActivePanel("history")}
              label="History"
              icon={<History size={10} />}
              isDarkTheme={isDarkTheme}
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          {activePanel === "output" && meta && (
            <div className={cn("hidden items-center gap-2 px-2 text-[9px] sm:flex", consoleMuted)}>
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
            onClick={activePanel === "output" ? handleCopy : undefined}
            disabled={activePanel === "history"}
            className="h-6 w-6 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => activePanel === "history" ? clearRunHistory() : activeFileId && clearOutput(activeFileId)}
            className="h-6 w-6 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            <Trash2 size={12} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleConsoleExpanded}
            className="h-6 w-6 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            title={isConsoleExpanded ? "Restore panel" : "Expand panel"}
          >
            {isConsoleExpanded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
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
      <div className="flex-1 overflow-y-auto p-2 sm:p-3">
        <AnimatePresence mode="popLayout">
          {activePanel === "history" ? (
            <RunHistory
              entries={visibleHistory}
              activeFileId={activeFileId}
              isDarkTheme={isDarkTheme}
            />
          ) : outputLogs.length === 0 ? (
            <div className={cn("h-full flex flex-col items-center justify-center", isDarkTheme ? "text-zinc-600" : "text-zinc-400")}>
              <Terminal size={28} strokeWidth={1} />
              <span className="text-[10px] mt-3 uppercase tracking-wide font-medium">No output</span>
              <span className="text-[9px] mt-1 opacity-50">Run code to see results here</span>
            </div>
          ) : (
            <div className="space-y-0.5">
              {outputLogs.map((log, i) => (
                <motion.div
                  key={`${activeFileId}-${i}`}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-1.5 text-[11px] sm:gap-2 sm:text-[12px]"
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
      <div className={cn("h-5 px-2 sm:px-3 flex items-center justify-between border-t text-[9px]", isDarkTheme ? "border-zinc-800 bg-zinc-900/50 text-zinc-500" : "border-zinc-300 bg-zinc-100 text-zinc-600")}>
        <span className="hidden sm:inline">
          {activePanel === "history"
            ? `${visibleHistory.length} run${visibleHistory.length !== 1 ? "s" : ""}`
            : `${outputLogs.length} line${outputLogs.length !== 1 ? "s" : ""}`}
        </span>
        <span className="uppercase tracking-wide">{activePanel === "history" ? "Run History" : "Output"}</span>
      </div>
    </div>
  )
}

function PanelTab({
  active,
  onClick,
  label,
  icon,
  isDarkTheme,
}: {
  active: boolean
  onClick: () => void
  label: string
  icon?: React.ReactNode
  isDarkTheme: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-5 items-center gap-1 rounded px-2 text-[10px] font-semibold transition-colors",
        active
          ? "bg-primary/15 text-primary"
          : isDarkTheme
            ? "text-zinc-500 hover:text-zinc-300"
            : "text-zinc-500 hover:text-zinc-800"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

function RunHistory({
  entries,
  activeFileId,
  isDarkTheme,
}: {
  entries: Array<{
    id: string
    fileId: string
    fileName: string
    language: string
    status: "success" | "error"
    outputPreview: string
    time: number
    memory: number
    createdAt: number
  }>
  activeFileId: string | null
  isDarkTheme: boolean
}) {
  if (entries.length === 0) {
    return (
      <div className={cn("h-full flex flex-col items-center justify-center", isDarkTheme ? "text-zinc-600" : "text-zinc-400")}>
        <History size={28} strokeWidth={1} />
        <span className="text-[10px] mt-3 uppercase tracking-wide font-medium">No runs yet</span>
        <span className="text-[9px] mt-1 opacity-50">Execute code to build history</span>
      </div>
    )
  }

  const formatTime = (timestamp: number) =>
    new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }).format(timestamp)

  return (
    <div className="space-y-1">
      {entries.map((entry) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "grid grid-cols-[auto_1fr_auto] gap-2 rounded-md border px-2 py-1.5 text-[11px]",
            isDarkTheme
              ? "border-zinc-800 bg-zinc-950/30"
              : "border-zinc-300 bg-white/50",
            entry.fileId === activeFileId && "border-primary/30 bg-primary/5"
          )}
        >
          <div className="flex items-center gap-1.5">
            {entry.status === "success" ? (
              <CheckCircle2 size={12} className="text-green-500" />
            ) : (
              <XCircle size={12} className="text-red-500" />
            )}
            <span className="w-14 text-zinc-500">{formatTime(entry.createdAt)}</span>
          </div>
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <span className={cn("truncate font-semibold", isDarkTheme ? "text-zinc-300" : "text-zinc-700")}>
                {entry.fileName}
              </span>
              <span className={cn(
                "shrink-0 rounded px-1.5 py-0.5 text-[9px] uppercase text-zinc-500",
                isDarkTheme ? "bg-zinc-800" : "bg-zinc-200"
              )}>
                {entry.language}
              </span>
            </div>
            <p className="mt-0.5 truncate text-zinc-500">{entry.outputPreview}</p>
          </div>
          <div className="hidden items-center gap-2 text-right text-[10px] text-zinc-500 sm:flex">
            {entry.time > 0 && <span>{entry.time}ms</span>}
            {entry.memory > 0 && <span>{(entry.memory / 1024 / 1024).toFixed(1)}MB</span>}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
