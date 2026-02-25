"use client"

import { useEffect, useRef } from "react"
import { useExecutionStore } from "@/store/useExecutionStore"
import { Button } from "@/components/ui/button"
import {
  PanelBottom,
  PanelLeft,
  PanelRight,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Timer,
  Cpu,
  Minimize2,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function ExecutionConsole() {
  const {
    tabs,
    activeTabId,
    layout,
    setLayout,
    clearOutput,
    toggleConsole
  } = useExecutionStore()

  const activeTab = tabs.find((t) => t.id === activeTabId)
  const consoleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop =
        consoleRef.current.scrollHeight
    }
  }, [activeTab?.output])

  if (!activeTab) return null

  const { status, meta } = activeTab

  const renderStatusIcon = () => {
    if (status === "running")
      return (
        <Loader2 className="h-3 w-3 animate-spin text-primary" />
      )

    if (status === "success")
      return (
        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
      )

    if (status === "error")
      return (
        <AlertCircle className="h-3 w-3 text-red-500" />
      )

    return null
  }

  return (
    <div className="h-full flex flex-col">
      <div className="h-11 px-4 flex items-center justify-between border-b bg-muted/30">
        <div className="flex items-center gap-3 text-xs">

          <span className="font-medium text-muted-foreground">
            Console
          </span>

          <div className="flex items-center gap-1">
            {renderStatusIcon()}

            <span
              className={cn(
                "capitalize font-medium",
                status === "running" && "text-primary",
                status === "success" && "text-emerald-500",
                status === "error" && "text-red-500"
              )}
            >
              {status}
            </span>
          </div>

          {meta?.time && (
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <div className="flex items-center gap-1">
              <Timer className="h-3 w-3" />
              <span>{meta.time}s</span>
              </div>
              {meta?.memory && (
              <div className="flex items-center gap-1">
                <Cpu className="h-3 w-3" />
                <span>{meta.memory} KB</span>
              </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1">

            <Button
              size="icon"
              variant={layout === "bottom" ? "secondary" : "ghost"}
              onClick={() => setLayout("bottom")}
              className="h-7 w-7"
            >
              <PanelBottom className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant={layout === "right" ? "secondary" : "ghost"}
              onClick={() => setLayout("right")}
              className="h-7 w-7"
            >
              <PanelRight className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant={layout === "left" ? "secondary" : "ghost"}
              onClick={() => setLayout("left")}
              className="h-7 w-7"
            >
              <PanelLeft className="h-4 w-4" />
            </Button>

          </div>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => clearOutput(activeTab.id)}
            className="h-7 w-7"
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={toggleConsole}
            className="h-7 w-7"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>

        </div>
      </div>

      <div
        ref={consoleRef}
        className="flex-1 overflow-y-auto px-4 py-3 font-mono text-sm bg-background"
      >
        {activeTab.output.length === 0 ? (
          <span className="text-muted-foreground">
            No output yet.
          </span>
        ) : (
          activeTab.output.map((line, i) => (
            <div
              key={i}
              className={cn(
                "leading-relaxed",
                status === "error"
                  ? "text-red-500"
                  : "text-foreground"
              )}
            >
              {line}
            </div>
          ))
        )}
      </div>
    </div>
  )
}