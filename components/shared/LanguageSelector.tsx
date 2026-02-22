"use client"

import { useExecutionStore } from "@/store/useExecutionStore"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

export default function LanguageSelector() {
  const { tabs, activeTabId, updateTab } = useExecutionStore()

  const activeTab = tabs.find((t) => t.id === activeTabId)

  if (!activeTab) return null

  return (
    <Select
      value={activeTab.language}
      onValueChange={(value) =>
        updateTab(activeTab.id, { language: value as any })
      }
    >
      <SelectTrigger className="w-37.5">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="javascript">JavaScript</SelectItem>
        <SelectItem value="python">Python</SelectItem>
        <SelectItem value="cpp">C++</SelectItem>
        <SelectItem value="java">Java</SelectItem>
      </SelectContent>
    </Select>
  )
}