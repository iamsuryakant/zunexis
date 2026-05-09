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
          source_code: code,
          language_id: language,
        })
      });

      const result = await response.json();

      if (result.status === "error" || result.stderr) {
        store.addOutput(fileId, result.stderr || result.message || "Execution failed");
        store.setStatus(fileId, "error");
      } else {
        const outputs: string[] = [];
        if (result.stdout) outputs.push(result.stdout);
        if (result.stderr) outputs.push(result.stderr);

        store.setStatus(fileId, "success");
        store.setMeta(fileId, {
          time: result.time || 0,
          memory: result.memory || 0
        });

        if (outputs.length > 0) {
          outputs.forEach(o => store.addOutput(fileId, o));
        } else {
          store.addOutput(fileId, "(No output)");
        }
      }
    } catch (error: any) {
      store.addOutput(fileId, `Error: ${error.message}`);
      store.setStatus(fileId, "error");
    }
  }
}

export const codeExecutor = new CodeExecutor();