"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Play, Trash2 } from "lucide-react"
import { useExecutionStore } from "@/store/useExecutionStore"
import ZunexisLogo from "@/components/shared/ZunexisLogo"
import ThemeToggle from "@/components/shared/ThemeToggle"
import LayoutSwitcher from "@/components/shared/LayoutSwitcher"

export default function ZunexisHeader() {
  const { code, setOutput, clear, status, setStatus } =
    useExecutionStore()

  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    const worker = new Worker("/codeWorker.js")

    worker.onmessage = (e) => {
      const { type, logs } = e.data
      setOutput(logs)
      setStatus(type === "success" ? "success" : "error")
    }

    workerRef.current = worker
    return () => worker.terminate()
  }, [setOutput, setStatus])

  const runCode = () => {
    setStatus("running")

    try {
      new Function(`"use strict";\n${code}`)
    } catch (error: any) {
      setOutput([error.toString()])
      setStatus("error")
      return
    }

    workerRef.current?.postMessage(code)
  }

  const statusStyles = {
    idle: "bg-muted text-muted-foreground",
    running: "bg-primary text-primary-foreground",
    success: "bg-emerald-500 text-white",
    error: "bg-red-500 text-white",
  }

  return (
    <header className="sticky top-0 z-50">

      <div
        className="
          h-16
          flex items-center justify-between
          px-8
          bg-background
          border-b border-border
          shadow-sm
        "
      >

        {/* Left Section */}
        <div className="flex items-center gap-6">
          <ZunexisLogo />

          <Badge
            className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
          >
            {status.toUpperCase()}
          </Badge>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">

          <LayoutSwitcher />
          <ThemeToggle />

          <Button
            onClick={runCode}
            disabled={status === "running"}
            className="flex items-center gap-2 shadow-sm"
          >
            {status === "running" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Executing
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Run
              </>
            )}
          </Button>

          <Button
            variant="secondary"
            onClick={clear}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>

        </div>

      </div>

    </header>
  )
}