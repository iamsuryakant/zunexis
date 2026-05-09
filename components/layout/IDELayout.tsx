"use client"

import { useState } from "react"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import Sidebar from "@/components/navigation/Sidebar"
import CodeEditor from "@/components/editor/CodeEditor"
import TabBar from "@/components/editor/TabBar"
import ExecutionConsole from "@/components/console/ExecutionConsole"
import { useExecutionStore } from "@/stores/useExecutionStore"
import { Menu, X } from "lucide-react"

function ResizeHandle({ direction = "horizontal" }: { direction?: "horizontal" | "vertical" }) {
  return (
    <PanelResizeHandle
      className={`
        relative flex items-center justify-center
        ${direction === "horizontal" ? "w-1 cursor-col-resize" : "h-1 cursor-row-resize"}
        bg-transparent hover:bg-primary/30 active:bg-primary/50 transition-colors
      `}
    >
      <div
        className={`
          ${direction === "horizontal" ? "w-0.5 h-8 rounded-full" : "h-0.5 w-8 rounded-full"}
          bg-border/50 group-hover:bg-primary/50 group-active:bg-primary transition-colors
        `}
      />
    </PanelResizeHandle>
  )
}

export default function IDELayout() {
  const { isConsoleCollapsed } = useExecutionStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="h-full w-full flex bg-background overflow-hidden relative">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-3 left-3 z-50 md:hidden p-2 rounded-lg bg-background/90 backdrop-blur border border-border/50 shadow-lg"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - hidden on mobile unless opened */}
      <div
        className={`
          fixed md:relative inset-y-0 left-0 z-50 md:z-auto
          w-64 md:w-auto transition-transform duration-200 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 h-full flex flex-col overflow-hidden">
        <PanelGroup direction="vertical">
          <Panel defaultSize={65} minSize={40} className="flex flex-col min-h-0">
            <TabBar />
            <div className="flex-1 min-h-0 bg-background">
              <CodeEditor />
            </div>
          </Panel>

          {!isConsoleCollapsed && (
            <>
              <ResizeHandle direction="vertical" />
              <Panel defaultSize={35} minSize={20} className="bg-card border-t border-border/30">
                <ExecutionConsole />
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>
    </div>
  )
}