"use client"

import {
  PanelGroup,
  Panel,
  PanelResizeHandle as ResizeHandle,
} from "react-resizable-panels"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useExecutionStore } from "@/store/useExecutionStore"
import CodeEditor from "../editor/CodeEditor"
import ExecutionConsole from "../console/ExecutionConsole"

export default function IDELayout() {
  const { status, layout } = useExecutionStore()

  const glowStyles = {
    running: "ring-2 ring-primary/30",
    success: "ring-2 ring-emerald-500/30",
    error: "ring-2 ring-red-500/30",
    idle: "",
  }

  const isVertical = layout === "bottom"

  return (
    <div className="h-full w-full">

      <PanelGroup
        direction={isVertical ? "vertical" : "horizontal"}
        autoSaveId="zunexis-layout"
        className="h-full w-full"
      >

        <Panel defaultSize={70} minSize={40} className="overflow-hidden">
          <Card
            className={cn(
              "h-full bg-card border border-border rounded-2xl shadow-md",
              glowStyles[status]
            )}
          >
            <CodeEditor />
          </Card>
        </Panel>

        <ResizeHandle
          className={
            isVertical
              ? "h-2 cursor-row-resize flex items-center justify-center"
              : "w-2 cursor-col-resize flex items-center justify-center"
          }
        >
          <div
            className={
              isVertical
                ? "h-[2px] w-16 bg-border rounded-full"
                : "w-[2px] h-12 bg-border rounded-full"
            }
          />
        </ResizeHandle>

        <Panel defaultSize={30} minSize={20} className="overflow-hidden">
          <Card className="h-full bg-card border border-border rounded-2xl shadow-sm">
            <ExecutionConsole />
          </Card>
        </Panel>

      </PanelGroup>

    </div>
  )
}