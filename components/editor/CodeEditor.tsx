"use client"

import dynamic from "next/dynamic"
import { useExecutionStore } from "@/store/useExecutionStore"
import { useTheme } from "next-themes"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
})

export default function CodeEditor() {
  const { tabs, activeTabId, updateTab } =
    useExecutionStore()
  const { resolvedTheme } = useTheme()

  const activeTab = tabs.find((t) => t.id === activeTabId)

  if (!activeTab) return null

  return (
    <div className="h-full w-full">
      <MonacoEditor
        height="100%"
        language={activeTab.language}
        theme={resolvedTheme === "dark" ? "vs-dark" : "vs"}
        value={activeTab.code}
        onChange={(value) =>
          updateTab(activeTab.id, { code: value || "" })
        }
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
        }}
      />
    </div>
  )
}