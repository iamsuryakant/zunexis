"use client"

import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels"
import { AnimatePresence } from "framer-motion"

import { useExecutionStore } from "@/store/useExecutionStore"
import CodeEditor from "../editor/CodeEditor"
import TabBar from "../editor/TabBar"
import { AnimatedConsole } from "../console/AnimatedConsole"

export default function IDELayout() {
  const { layout, isConsoleCollapsed } = useExecutionStore()

  const isVertical = layout === "bottom"

  return (
    <div className="h-full w-full overflow-hidden">

      <PanelGroup
        direction={isVertical ? "vertical" : "horizontal"}
        className="h-full w-full"
      >

        {/* LEFT CONSOLE */}
        {layout === "left" && !isConsoleCollapsed && (
          <>
            <Panel defaultSize={30} minSize={20}>
              <AnimatedConsole layout="left" />
            </Panel>
            <PanelResizeHandle className="bg-border w-1 cursor-col-resize" />
          </>
        )}

        {/* EDITOR */}
        <Panel minSize={40}>
          <div className="h-full flex flex-col">
            <TabBar />
            <div className="flex-1 overflow-hidden">
              <CodeEditor />
            </div>
          </div>
        </Panel>

        {/* RIGHT / BOTTOM CONSOLE */}
        {(layout === "right" || layout === "bottom") && (
          <AnimatePresence>
            {!isConsoleCollapsed && (
              <>
                <PanelResizeHandle
                  className={
                    isVertical
                      ? "bg-border h-1 cursor-row-resize"
                      : "bg-border w-1 cursor-col-resize"
                  }
                />
                <Panel defaultSize={30} minSize={20}>
                  <AnimatedConsole layout={layout} />
                </Panel>
              </>
            )}
          </AnimatePresence>
        )}

      </PanelGroup>
    </div>
  )
}