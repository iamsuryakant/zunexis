"use client"

import { ReactNode, createContext, useContext, useState, useCallback, useEffect } from "react"

interface CommandPaletteContextType {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

const CommandPaletteContext = createContext<CommandPaletteContextType>({
  isOpen: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
})

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen(prev => !prev), [])

  useEffect(() => {
    const handleOpen = () => open()
    document.addEventListener('open-command-palette', handleOpen)

    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "p") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        open()
      }
      if (e.key === "Escape" && isOpen) {
        close()
      }
    }
    document.addEventListener("keydown", down)

    return () => {
      document.removeEventListener('open-command-palette', handleOpen)
      document.removeEventListener("keydown", down)
    }
  }, [open, close, isOpen])

  return (
    <CommandPaletteContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </CommandPaletteContext.Provider>
  )
}

export function useCommandPalette() {
  return useContext(CommandPaletteContext)
}