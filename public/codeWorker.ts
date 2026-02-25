/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference lib="webworker" />

const EXECUTION_TIMEOUT = 10000

let intervalIds: number[] = []
let timeoutIds: number[] = []

self.onmessage = (e: MessageEvent) => {
  const { code, tabId } = e.data

  intervalIds = []
  timeoutIds = []

  const send = (payload: any) => {
    self.postMessage({ ...payload, tabId })
  }

  const consoleMock = {
    log: (...args: any[]) =>
      send({ type: "log", logs: [args.join(" ")] }),
    error: (...args: any[]) =>
      send({ type: "log", logs: [args.join(" ")] }),
    warn: (...args: any[]) =>
      send({ type: "log", logs: [args.join(" ")] }),
  }

  const setTimeoutMock = (
    fn: (...args: any[]) => void,
    delay?: number,
    ...args: any[]
  ) => {
    const id = self.setTimeout(() => {
      fn(...args)
      timeoutIds = timeoutIds.filter(t => t !== id)
    }, delay)
    timeoutIds.push(id)
    return id
  }

  const setIntervalMock = (
    fn: (...args: any[]) => void,
    delay?: number,
    ...args: any[]
  ) => {
    const id = self.setInterval(() => fn(...args), delay)
    intervalIds.push(id)
    return id
  }

  const clearTimeoutMock = (id: number) => {
    timeoutIds = timeoutIds.filter(t => t !== id)
    clearTimeout(id)
  }

  const clearIntervalMock = (id: number) => {
    intervalIds = intervalIds.filter(i => i !== id)
    clearInterval(id)
  }

  try {
    send({ type: "running" })

    const asyncFunction = new Function(
      "console",
      "setTimeout",
      "setInterval",
      "clearTimeout",
      "clearInterval",
      `
        "use strict";
        return (async () => {
          ${code}
        })();
      `
    )

    const execution = asyncFunction(
      consoleMock,
      setTimeoutMock,
      setIntervalMock,
      clearTimeoutMock,
      clearIntervalMock
    )

    const hardTimeout = self.setTimeout(() => {
      send({
        type: "timeout",
        logs: ["Execution Timeout (10s)"],
      })
    }, EXECUTION_TIMEOUT)

    Promise.resolve(execution)
      .then(() => {
        // Only finish when no active timers
        const checkCompletion = () => {
          if (intervalIds.length === 0 && timeoutIds.length === 0) {
            clearTimeout(hardTimeout)
            send({ type: "done" })
          } else {
            self.setTimeout(checkCompletion, 50)
          }
        }

        checkCompletion()
      })
      .catch((err: any) => {
        clearTimeout(hardTimeout)
        send({
          type: "error",
          logs: [err?.message || String(err)],
        })
      })

  } catch (err: any) {
    send({
      type: "error",
      logs: [err?.message || String(err)],
    })
  }
}