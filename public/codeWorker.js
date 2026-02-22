self.onmessage = function (e) {
  const { code, tabId } = e.data

  const MAX_LOGS = 1000
  let logCount = 0

  const sendLog = (message) => {
    if (logCount >= MAX_LOGS) return
    logCount++

    self.postMessage({
      type: "log",
      logs: [message],
      tabId,
    })
  }

  const consoleMock = {
    log: (...args) => sendLog(args.join(" ")),
    error: (...args) => sendLog(args.join(" ")),
    warn: (...args) => sendLog(args.join(" ")),
    clear: () =>
      self.postMessage({
        type: "clear",
        tabId,
      }),
  }

  try {
    new Function("console", `"use strict";\n${code}`)(consoleMock)
  } catch (error) {
    self.postMessage({
      type: "error",
      logs: [error.toString()],
      tabId,
    })
  }
}