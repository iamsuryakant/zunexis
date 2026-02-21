"use client"

import { useExecutionStore } from "@/store/useExecutionStore"

export default function ExecutionConsole() {
  const output = useExecutionStore((s) => s.output)

  return (
    <div className="h-full p-6 overflow-y-auto font-mono text-sm bg-background">

      {output.length === 0 ? (
        <p className="text-muted-foreground">
          No output yet.
        </p>
      ) : (
        output.map((line, index) => (
          <div
            key={index}
            className="border-l-2 border-primary pl-4 mb-2 text-foreground"
          >
            {line}
          </div>
        ))
      )}

    </div>
  )
}