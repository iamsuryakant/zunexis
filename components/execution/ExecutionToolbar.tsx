"use client"

import { useExecutionStore } from "@/store/useExecutionStore"

export default function ExecutionToolbar() {
  const { code, setOutput, clear } = useExecutionStore()

  const runCode = () => {
    try {
      const logs: string[] = []

      const consoleMock = {
        log: (...args: any[]) => logs.push(args.join(" "))
      }

      new Function("console", code)(consoleMock)
      setOutput(logs)
    } catch (error: any) {
      setOutput([error.toString()])
    }
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={runCode}
        className="bg-cyan-500 hover:bg-cyan-600 px-4 py-1 rounded text-sm"
      >
        Run
      </button>

      <button
        onClick={clear}
        className="bg-slate-700 hover:bg-slate-600 px-4 py-1 rounded text-sm"
      >
        Clear
      </button>
    </div>
  )
}