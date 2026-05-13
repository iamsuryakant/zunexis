"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import Sidebar from "@/components/navigation/Sidebar"
import CodeEditor from "@/components/editor/CodeEditor"
import TabBar from "@/components/editor/TabBar"
import ExecutionConsole from "@/components/console/ExecutionConsole"
import { useExecutionStore } from "@/stores/useExecutionStore"
import { Menu, X } from "lucide-react"

export default function IDELayout() {
  const { isConsoleCollapsed } = useExecutionStore()
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
          transition-transform duration-200 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <Sidebar width={sidebarWidth} />
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
        <div className="flex flex-col min-h-0 flex-1">
          <TabBar />
          <div className="flex-1 min-h-0">
            <CodeEditor />
          </div>
        </div>

        {!isConsoleCollapsed && (
          <>
            <div className="h-1 bg-border hover:bg-primary/50 active:bg-primary transition-colors shrink-0" />
            <div className="shrink-0 h-[35%] min-h-25">
              <ExecutionConsole />
            </div>
          </>
        )}
      </div>
    </div>
  )
}