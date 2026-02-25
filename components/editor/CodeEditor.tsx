"use client"

import dynamic from "next/dynamic"
import { useMemo, useCallback, useRef } from "react"
import { useExecutionStore } from "@/store/useExecutionStore"
import { useTheme } from "next-themes"
import { LANGUAGES } from "@/lib/languages"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
})

export default function CodeEditor() {
  const {
    tabs,
    activeTabId,
    updateTab,
  } = useExecutionStore()

  const { resolvedTheme } = useTheme()

  const activeTab = useMemo(
    () => tabs.find((t) => t.id === activeTabId),
    [tabs, activeTabId]
  )

  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const handleChange = useCallback(
    (value?: string) => {
      if (!activeTab) return

      const newCode = value ?? ""

      updateTab(activeTab.id, { code: newCode })

      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      debounceRef.current = setTimeout(() => {
        updateTab(activeTab.id, {
          languageMemory: {
            ...activeTab.languageMemory,
            [activeTab.language]: newCode,
          },
        })
      }, 800)
    },
    [activeTab, updateTab]
  )

  if (!activeTab) return null

  const langConfig = LANGUAGES.find(
    (l) => l.key === activeTab.language
  )

  return (
    <div className="h-full w-full min-h-0">

      <MonacoEditor
        height="100%"
        language={langConfig?.monaco}
        theme={resolvedTheme === "dark" ? "vs-dark" : "vs"}
        value={activeTab.code}
        onChange={handleChange}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          padding: { top: 16 },
        }}
      />
    </div>
  )
}