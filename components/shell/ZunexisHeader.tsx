"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Play, Trash2 } from "lucide-react";
import { useExecutionStore } from "@/store/useExecutionStore";
import ZunexisLogo from "@/components/shared/ZunexisLogo";
import ThemeToggle from "@/components/shared/ThemeToggle";
import Link from "next/link";
import { IconBrandGithub } from "@tabler/icons-react";

export default function ZunexisHeader() {
  const { tabs, activeTabId, updateTab, clearOutput } = useExecutionStore();
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
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="flex h-14 md:h-16 items-center justify-between px-4 md:px-8">

        
        <div className="flex items-center gap-3 md:gap-6">
          <ZunexisLogo />

          <Badge
            className={`rounded-full px-2 md:px-3 py-0.5 text-[10px] md:text-xs font-medium ${statusStyles[activeTab.status]}`}
          >
            {activeTab.status.toUpperCase()}
          </Badge>
        </div>

        
        <div className="flex items-center gap-2 md:gap-3">

          <ThemeToggle />

         
          <Button
            size="sm"
            onClick={runCode}
            disabled={activeTab.status === "running"}
            className="flex items-center gap-2"
          >
            {activeTab.status === "running" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden md:inline">Executing</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span className="hidden md:inline">Run</span>
              </>
            )}
          </Button>

          
          <Button
            size="sm"
            variant="secondary"
            onClick={() => clearOutput(activeTab.id)}
            className="flex items-center gap-1"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden md:inline">Clear</span>
          </Button>

          
          <Link
            href="https://github.com/iamsuryakant/zunexis"
            target="_blank"
            className="flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
          >
            <IconBrandGithub className="h-5 w-5 md:h-6 md:w-6" />
          </Link>

        </div>
      </div>
    </header>
  );
}