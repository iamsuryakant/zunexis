"use client";

import { X, Plus, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useExecutionStore } from "@/store/useExecutionStore";

export default function TabBar() {
  const { tabs, activeTabId, setActiveTab, addTab, closeTab, updateTab } =
    useExecutionStore();

  const activeTab = tabs.find((t) => t.id === activeTabId);
  if (!activeTab) return null;

  const runCode = () => {
    const store = useExecutionStore.getState();

    store.updateTab(activeTab.id, {
      status: "running",
      output: [],
    });

    const worker = new Worker("/codeWorker.js");
    const EXECUTION_LIMIT = 3000;

    const timeout = setTimeout(() => {
      worker.terminate();
      useExecutionStore.getState().updateTab(activeTab.id, {
        status: "success",
      });
    }, EXECUTION_LIMIT);

    worker.onmessage = (e) => {
      const { type, logs, tabId } = e.data;
      const currentStore = useExecutionStore.getState();
      const currentTab = currentStore.tabs.find((t) => t.id === tabId);
      if (!currentTab) return;

      if (type === "log") {
        currentStore.updateTab(tabId, {
          output: [...currentTab.output, ...logs],
        });
        return;
      }

      if (type === "clear") {
        currentStore.updateTab(tabId, { output: [] });
        return;
      }

      if (type === "error") {
        clearTimeout(timeout);
        worker.terminate();

        currentStore.updateTab(tabId, {
          output: logs,
          status: "error",
        });
      }
    };

    worker.postMessage({
      code: activeTab.code,
      tabId: activeTab.id,
    });
  };

  const statusStyles = {
    idle: "bg-muted text-muted-foreground",
    running: "bg-primary text-primary-foreground",
    success: "bg-emerald-500 text-white",
    error: "bg-red-500 text-white",
  };

  return (
    <div className="flex items-center border-b border-border bg-muted/40 px-4 h-12">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                shrink-0 flex items-center gap-2 px-4 py-2
                rounded-t-lg cursor-pointer text-sm whitespace-nowrap
                ${
                  activeTabId === tab.id
                    ? "bg-background border border-border border-b-0 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }
              `}
            >
              {tab.name}

              {tabs.length > 1 && (
                <X
                  className="h-3 w-3 opacity-70 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                />
              )}
            </div>
          ))}
          <Button size="icon" variant="ghost" onClick={addTab} className="ml-2">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 ml-3">
        <Badge className={`text-xs ${statusStyles[activeTab.status]}`}>
          {activeTab.status.toUpperCase()}
        </Badge>

        <Button
          size="sm"
          onClick={runCode}
          disabled={activeTab.status === "running"}
          className="flex items-center gap-2"
        >
          {activeTab.status === "running" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          <span className="hidden md:inline">Run</span>
        </Button>
      </div>
    </div>
  );
}
