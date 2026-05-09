"use client"

import { useExecutionStore } from "@/stores/useExecutionStore"
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Terminal,
  Trash2,
  Cpu,
  Hash,
  Minimize2,
  Maximize2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export default function ExecutionConsole() {
  const { activeFileId, outputs, statuses, clearOutput, isConsoleCollapsed, toggleConsole } = useExecutionStore()

  const outputLogs = activeFileId ? (outputs[activeFileId] || []) : []
  const status = activeFileId ? (statuses[activeFileId] || "idle") : "idle"

  const statusConfig = {
    idle: { label: "Standby", icon: Cpu, color: "text-muted-foreground/40" },
    running: { icon: Loader2, label: "Executing", color: "text-blue-400" },
    success: { icon: CheckCircle2, label: "Success", color: "text-emerald-400" },
    error: { icon: XCircle, label: "Failed", color: "text-rose-400" },
  }

  const current = statusConfig[status as keyof typeof statusConfig] || statusConfig.idle

  return (
    <div className="flex flex-col h-full bg-background/50 font-mono selection:bg-primary/30">
      {/* Terminal Header - Refined for "Output" focus */}
      <div className="h-9 flex items-center justify-between px-4 border-b border-white/3 bg-background/60 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <current.icon
              size={12}
              className={cn(current.color, status === "running" && "animate-spin")}
            />
            <span className={cn("text-[10px] font-bold uppercase tracking-[0.15em]", current.color)}>
              {current.label}
            </span>
          </div>
          <div className="h-3 w-px bg-white/10" />
          <span className="text-[10px] text-muted-foreground/30 font-medium uppercase tracking-widest">
            Read-Only Output
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleConsole}
            className="h-6 w-6 text-muted-foreground/30 hover:text-foreground transition-colors rounded-md"
          >
            {isConsoleCollapsed ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => activeFileId && clearOutput(activeFileId)}
            className="h-6 w-6 text-muted-foreground/30 hover:text-foreground transition-colors rounded-md"
          >
            <Trash2 size={13} />
          </Button>
        </div>
      </div>

      {/* Output Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        <AnimatePresence mode="popLayout">
          {outputLogs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-10">
              <Terminal size={32} strokeWidth={1} />
              <span className="text-[10px] mt-2 uppercase tracking-widest font-bold">No Output Generated</span>
            </div>
          ) : (
            <>
              {outputLogs.map((log, i) => (
                <motion.div
                  key={`${activeFileId}-${i}`}
                  initial={{ opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 text-[12px] group"
                >
                  <span className="text-muted-foreground/10 text-[10px] w-4 text-right tabular-nums select-none mt-0.5">
                    {i + 1}
                  </span>
                  <div className={cn(
                    "flex-1 break-all whitespace-pre-wrap leading-relaxed",
                    status === "error" && i === outputLogs.length - 1 ? "text-rose-400" : "text-foreground/80"
                  )}>
                    {log}
                  </div>
                </motion.div>
              ))}
              
              {/* Process Finished Indicator */}
              {status !== "running" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="pt-4 flex items-center gap-2 text-[10px] text-muted-foreground/20 italic select-none"
                >
                  <Hash size={10} />
                  <span>Process exited with status: {status}</span>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Metadata Footer */}
      <div className="h-6 px-4 flex items-center justify-between border-t border-white/2 bg-black/10">
        <div className="flex items-center gap-4 text-[9px] font-bold text-muted-foreground/20 uppercase tracking-tighter">
          <span>Logs: {outputLogs.length}</span>
          <span>Buffer: Raw Text</span>
        </div>
      </div>
    </div>
  )
}