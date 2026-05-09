/* eslint-disable @typescript-eslint/no-explicit-any */
let workerInstance: Worker | null = null;

export function runJSWorker(
  code: string,
  input: string,
  tabId: string,
  onUpdate: (payload: any) => void
) {
  if (workerInstance) {
    workerInstance.terminate();
  }

  // Ensure the path to your worker is correct
  workerInstance = new Worker(new URL("../public/codeWorker.ts", import.meta.url), {
    type: "module",
  });

  workerInstance.onmessage = (event) => {
    const { type, logs } = event.data;

    // Handle different message types from your worker
    switch (type) {
      case "running":
        onUpdate({ type: "status", status: "running" });
        break;
      case "log":
        onUpdate({ type: "log", logs });
        break;
      case "error":
      case "timeout":
        onUpdate({ type: "error", logs: logs || ["An unknown error occurred"] });
        break;
      case "done":
        onUpdate({ type: "done" });
        break;
    }
  };

  workerInstance.onerror = (err) => {
    onUpdate({ type: "error", logs: ["Worker Error: Check console for details."] });
    console.error("Worker Crash:", err);
  };

  workerInstance.postMessage({ code, input, tabId });
}