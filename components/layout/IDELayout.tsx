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
import TabBar from "../editor/TabBar"

export default function IDELayout() {
  const { tabs, activeTabId, layout } = useExecutionStore()

  const activeTab = tabs.find((t) => t.id === activeTabId)
  if (!activeTab) return null

  const isVertical = layout === "bottom"

  const statusStyles = {
    running: "border-primary/40 shadow-sm",
    success: "border-emerald-500/40 shadow-sm",
    error: "border-red-500/40 shadow-sm",
    idle: "border-border shadow-sm",
  }

  return (
    <div className="h-full w-full">

      <PanelGroup
        direction={isVertical ? "vertical" : "horizontal"}
        autoSaveId="zunexis-layout"
        className="h-full w-full"
      >

        {/* LEFT CONSOLE */}
        {layout === "left" && (
          <>
            <Panel defaultSize={30} minSize={20} className="overflow-hidden">
              <Card className="h-full bg-card border border-border rounded-2xl shadow-sm">
                <ExecutionConsole />
              </Card>
            </Panel>

            <ResizeHandle className="w-2 cursor-col-resize flex items-center justify-center">
              <div className="w-[2px] h-12 bg-border rounded-full" />
            </ResizeHandle>
          </>
        )}

        {/* EDITOR PANEL */}
        <Panel defaultSize={70} minSize={40} className="overflow-hidden">
          <Card
            className={cn(
              "h-full flex flex-col bg-card rounded-2xl transition-all duration-200",
              statusStyles[activeTab.status]
            )}
          >
            <TabBar />
            <div className="flex-1 overflow-hidden">
              <CodeEditor />
            </div>
          </Card>
        </Panel>

        {/* BOTTOM OR RIGHT CONSOLE */}
        {layout !== "left" && (
          <>
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
          </>
        )}

      </PanelGroup>

    </div>
  )
}