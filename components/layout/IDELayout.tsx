"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import Sidebar from "@/components/navigation/Sidebar"
import CodeEditor from "@/components/editor/CodeEditor"
import TabBar from "@/components/editor/TabBar"
import ExecutionConsole from "@/components/console/ExecutionConsole"
import { useExecutionStore } from "@/stores/useExecutionStore"
import { PanelLeft, X } from "lucide-react"

export default function IDELayout() {
  const { isConsoleCollapsed, isConsoleExpanded, sidebarView, setSidebarView } = useExecutionStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(280)
  const [isResizing, setIsResizing] = useState(false)
  const resizingRef = useRef(false)
  const startXRef = useRef(0)
  const startWidthRef = useRef(280)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    resizingRef.current = true
    startXRef.current = e.clientX
    startWidthRef.current = sidebarWidth
    setIsResizing(true)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [sidebarWidth])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingRef.current) return
      const delta = e.clientX - startXRef.current
      const newWidth = Math.max(200, Math.min(600, startWidthRef.current + delta))
      setSidebarWidth(newWidth)
    }

    const handleMouseUp = () => {
      resizingRef.current = false
      setIsResizing(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const openMobileSidebar = () => {
    if (!sidebarOpen && !sidebarView) {
      setSidebarView("explorer")
    }
    setSidebarOpen((open) => !open)
  }

  return (
    <div className="h-full w-full flex bg-background overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="absolute inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - hidden on mobile unless opened */}
      <div
        className={`
          absolute md:relative inset-y-0 left-0 z-50 md:z-auto w-[min(92vw,360px)] md:w-auto
          transition-transform duration-200 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <Sidebar width={sidebarWidth} onRequestClose={() => setSidebarOpen(false)} />
      </div>

      {/* Resize Handle */}
      <div
        className={`
          hidden md:flex w-1 cursor-col-resize bg-transparent hover:bg-primary/30 active:bg-primary/50
          transition-colors relative group shrink-0
          ${isResizing ? 'bg-primary/50' : ''}
        `}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-transparent group-hover:bg-primary/50 group-active:bg-primary transition-colors" />
      </div>

      {/* Main Content */}
      <div className="flex-1 h-full flex flex-col overflow-hidden min-w-0">
        <div className="flex h-11 shrink-0 items-center gap-2 border-b border-border/40 bg-background px-2 md:hidden">
          <button
            onClick={openMobileSidebar}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border/50 bg-muted/40 text-muted-foreground shadow-sm active:scale-95"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={17} /> : <PanelLeft size={17} />}
          </button>
          <span className="truncate text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/60">
            Workspace
          </span>
        </div>
        <div className="flex flex-col min-h-0 flex-1">
          <TabBar />
          <div className="flex-1 min-h-0">
            <CodeEditor />
          </div>
        </div>

        {!isConsoleCollapsed && (
          <>
            <div className="h-1 bg-border hover:bg-primary/50 active:bg-primary transition-colors shrink-0" />
            <div
              className={
                isConsoleExpanded
                  ? "h-[58dvh] min-h-64 shrink-0 md:h-[62%]"
                  : "h-[32dvh] min-h-36 shrink-0 md:h-[35%] md:min-h-25"
              }
            >
              <ExecutionConsole />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
