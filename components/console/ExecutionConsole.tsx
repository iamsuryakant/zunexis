"use client"

import { useExecutionStore } from "@/store/useExecutionStore"
import { Button } from "@/components/ui/button"
import { PanelBottom, PanelLeft, PanelRight } from "lucide-react"

export default function ExecutionConsole() {
  const {
    tabs,
    activeTabId,
    layout,
    setLayout,
  } = useExecutionStore()

  const activeTab = tabs.find((t) => t.id === activeTabId)
  if (!activeTab) return null

  return (
    <div className="h-full flex flex-col">

      {/* Console Header */}
      <div className="flex items-center justify-between px-4 h-10 border-b border-border bg-muted/40">

        <span className="text-xs font-medium text-muted-foreground">
          Console
        </span>

        <div className="flex gap-1">

          <Button
            size="icon"
            variant={layout === "bottom" ? "default" : "ghost"}
            onClick={() => setLayout("bottom")}
            className="h-7 w-7"
          >
            <PanelBottom className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant={layout === "right" ? "default" : "ghost"}
            onClick={() => setLayout("right")}
            className="h-7 w-7"
          >
            <PanelRight className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant={layout === "left" ? "default" : "ghost"}
            onClick={() => setLayout("left")}
            className="h-7 w-7"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>

        </div>
      </div>

      {/* Output */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-sm bg-background">

        {activeTab.output.length === 0 ? (
          <p className="text-muted-foreground">
            No output yet.
          </p>
        ) : (
          activeTab.output.map((line, index) => (
            <div
              key={index}
              className="border-l-2 border-primary pl-3 mb-2"
            >
              {line}
            </div>
          ))
        )}

      </div>
    </div>
  )
}