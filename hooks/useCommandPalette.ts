"use client"

import { useEffect, useCallback } from "react"

let isRegistered = false

export function useCommandPalette(onOpen: () => void) {
  const handleOpen = useCallback(() => {
    onOpen()
  }, [onOpen])

  useEffect(() => {
    if (isRegistered) return
    isRegistered = true

    const handler = () => handleOpen()
    document.addEventListener('open-command-palette', handler)

    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "p") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handleOpen()
      }
    }
    document.addEventListener("keydown", down)

    return () => {
      document.removeEventListener('open-command-palette', handler)
      document.removeEventListener("keydown", down)
    }
  }, [handleOpen])
}