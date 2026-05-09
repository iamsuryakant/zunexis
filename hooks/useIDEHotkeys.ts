"use client"

import { useEffect } from "react"
import { useExecutionStore } from "@/stores/useExecutionStore"

export function useIDEHotkeys() {
  const {
    executeCode,
    toggleConsole,
    openFileIds,
    activeFileId,
    setActiveFile,
    files,
  } = useExecutionStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac =
        navigator.platform
          .toUpperCase()
          .includes("MAC")

      const modifier = isMac
        ? e.metaKey
        : e.ctrlKey

      if (!modifier) return

      const key = e.key.toLowerCase()

      if (key === "enter") {
        e.preventDefault()
        executeCode()
      }

      if (key === "j") {
        e.preventDefault()
        toggleConsole()
      }

      if (key === "arrowright") {
        e.preventDefault()
        const i = openFileIds.findIndex(
          (id) => id === activeFileId
        )
        const nextIndex = (i + 1) % openFileIds.length
        if (openFileIds[nextIndex]) {
          setActiveFile(openFileIds[nextIndex])
        }
      }

      if (key === "arrowleft") {
        e.preventDefault()
        const i = openFileIds.findIndex(
          (id) => id === activeFileId
        )
        const prevIndex = (i - 1 + openFileIds.length) % openFileIds.length
        if (openFileIds[prevIndex]) {
          setActiveFile(openFileIds[prevIndex])
        }
      }
    }

    window.addEventListener(
      "keydown",
      handler
    )
    return () =>
      window.removeEventListener(
        "keydown",
        handler
      )
  }, [
    executeCode,
    toggleConsole,
    openFileIds,
    activeFileId,
    setActiveFile,
    files,
  ])
}