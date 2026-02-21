"use client"

import dynamic from "next/dynamic"
import { useExecutionStore } from "@/store/useExecutionStore"
import { useTheme } from "next-themes"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
})

export default function CodeEditor() {
  const { code, setCode } = useExecutionStore()
  const { resolvedTheme } = useTheme()

  return (
    <div className="h-full w-full">
      <MonacoEditor
        height="100%"
        defaultLanguage="javascript"
        theme={resolvedTheme === "dark" ? "vs-dark" : "vs"}
        value={code}
        onChange={(value) => setCode(value || "")}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  )
}