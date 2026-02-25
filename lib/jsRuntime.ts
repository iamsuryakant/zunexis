/* eslint-disable @typescript-eslint/no-explicit-any */
let worker: Worker | null = null

export function runJSWorker(
  code: string,
  tabId: string,
  set: any
) {
  if (worker) {
    worker.terminate()
    worker = null
  }

  worker = new Worker(
    new URL("../public/codeWorker.ts", import.meta.url),
    { type: "module" }
  )

  set((state: any) => ({
    tabs: state.tabs.map((t: any) =>
      t.id === tabId
        ? { ...t, status: "running", output: [] }
        : t
    ),
  }))

  worker.onmessage = (event) => {
    const { type, logs, tabId: incomingTabId } =
      event.data

    if (incomingTabId !== tabId) return

    if (type === "log") {
      set((state: any) => ({
        tabs: state.tabs.map((t: any) =>
          t.id === tabId
            ? { ...t, output: [...t.output, ...logs] }
            : t
        ),
      }))
    }

    if (type === "done") {
      set((state: any) => ({
        tabs: state.tabs.map((t: any) =>
          t.id === tabId
            ? { ...t, status: "success" }
            : t
        ),
      }))
      worker?.terminate()
      worker = null
    }

    if (type === "error" || type === "timeout") {
      set((state: any) => ({
        tabs: state.tabs.map((t: any) =>
          t.id === tabId
            ? {
                ...t,
                status: "error",
                output: [...t.output, ...logs],
              }
            : t
        ),
      }))
      worker?.terminate()
      worker = null
    }
  }

  worker.postMessage({ code, tabId })
}