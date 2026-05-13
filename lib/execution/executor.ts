import { useExecutionStore } from "@/stores/useExecutionStore";

class CodeExecutor {
  async execute(code: string, language: string, fileId: string): Promise<void> {
    const store = useExecutionStore.getState();

    store.setStatus(fileId, "running");
    store.clearOutput(fileId);

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          version: "*",
          code,
        })
      });

      const result = await response.json();

      if (result.status === "error") {
        store.addOutput(fileId, result.message || "Execution failed");
        store.setStatus(fileId, "error");
      } else {
        const run = result.data?.run || result.run || {};
        const stdout = run.stdout || run.output || "";
        const stderr = run.stderr || "";
        const exitCode = run.code;

        if (stderr) {
          store.addOutput(fileId, stderr);
          store.setStatus(fileId, "error");
        } else if (exitCode !== 0) {
          store.addOutput(fileId, `Process exited with code ${exitCode}`);
          store.setStatus(fileId, "error");
        } else if (stdout) {
          store.addOutput(fileId, stdout);
          store.setStatus(fileId, "success");
        } else {
          store.addOutput(fileId, "(No output)");
          store.setStatus(fileId, "success");
        }

        store.setMeta(fileId, {
          time: run.cpu_time || run.wall_time || 0,
          memory: run.memory || 0
        });
      }
    } catch (error: any) {
      store.addOutput(fileId, `Error: ${error.message}`);
      store.setStatus(fileId, "error");
    }
  }
}

export const codeExecutor = new CodeExecutor();