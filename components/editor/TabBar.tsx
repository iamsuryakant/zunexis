"use client";

import { useEffect, useRef } from "react";
import { useExecutionStore } from "@/store/useExecutionStore";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Loader2, X, Terminal } from "lucide-react";

const languages = [
  { label: "JavaScript", value: "javascript" },
  { label: "Python", value: "python" },
  { label: "C++", value: "cpp" },
  { label: "Java", value: "java" },
  { label: "C", value: "c" },
  { label: "Bash", value: "bash" },
];

export default function TabBar() {
  const {
    tabs,
    activeTabId,
    setActiveTab,
    addTab,
    closeTab,
    executeCode,
    switchLanguage,
    toggleConsole,
  } = useExecutionStore();

  const activeTab = tabs.find((t) => t.id === activeTabId);
  const isRunning = activeTab?.status === "running";

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const activeEl = container.querySelector(
      `[data-tab-id="${activeTabId}"]`,
    ) as HTMLElement | null;

    activeEl?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeTabId]);

  if (!activeTab) return null;

  return (
    <div className="h-14 shrink-0 border-b bg-background flex items-center px-4">
      <div
        ref={scrollRef}
        className="flex-1 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide"
      >
        {tabs.map((tab) => (
          <div
            key={tab.id}
            data-tab-id={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 h-8 rounded-md text-xs cursor-pointer transition shrink-0
              ${
                tab.id === activeTabId
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/60"
              }`}
          >
            {tab.status === "running" && (
              <Loader2 className="h-3 w-3 animate-spin text-primary" />
            )}
            <span className="truncate max-w-30">{tab.name}</span>

            <X
              className="h-3 w-3 opacity-40 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
            />
          </div>
        ))}

        <Button
          size="sm"
          variant="ghost"
          onClick={addTab}
          className="h-8 text-xs shrink-0"
        >
          +
        </Button>
      </div>

      <div className="flex items-center gap-3 shrink-0 ml-4">
        <Select
          value={activeTab.language}
          onValueChange={(val) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            switchLanguage(activeTab.id, val as any)
          }
        >
          <SelectTrigger className="w-32.5 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          size="sm"
          disabled={isRunning}
          onClick={executeCode}
          className="h-8 text-xs min-w-23.75"
        >
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Running
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-1" />
              Run
            </>
          )}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleConsole}
          className="h-8 w-8"
        >
          <Terminal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
