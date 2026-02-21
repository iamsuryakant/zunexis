self.onmessage = function (e) {
  const code = e.data

  let logs = []

  const consoleMock = {
    log: (...args) => logs.push(args.join(" "))
  }

  try {
    new Function("console", `"use strict";\n${code}`)(consoleMock)
    self.postMessage({ type: "success", logs })
  } catch (error) {
    self.postMessage({ type: "error", logs: [error.toString()] })
  }
}