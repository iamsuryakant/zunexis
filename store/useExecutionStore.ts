import { create } from "zustand"

export type Status = "idle" | "running" | "success" | "error"
export type LayoutPosition = "bottom" | "right" | "left"

interface ExecutionState {
  code: string
  output: string[]
  status: Status
  layout: LayoutPosition
  setCode: (code: string) => void
  setOutput: (output: string[]) => void
  setStatus: (status: Status) => void
  setLayout: (layout: LayoutPosition) => void
  clear: () => void
}

export const useExecutionStore = create<ExecutionState>((set) => ({
  code: `console.log("Welcome to Zunexis 🚀")`,
  output: [],
  status: "idle",
  layout: "bottom",

  setCode: (code) => set({ code }),
  setOutput: (output) => set({ output }),
  setStatus: (status) => set({ status }),
  setLayout: (layout) => set({ layout }),

  clear: () =>
    set({
      output: [],
      status: "idle",
    }),
}))