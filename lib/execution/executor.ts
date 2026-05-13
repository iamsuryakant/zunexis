import { useExecutionStore } from "@/stores/useExecutionStore";

class CodeExecutor {
  async execute(code: string, language: string, fileId: string): Promise<void> {
    const store = useExecutionStore.getState();
    const activeFile = store.files.find((file) => file.id === fileId);

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
        const message = result.message || "Execution failed";
        store.addOutput(fileId, message);
        store.setStatus(fileId, "error");
        store.addRunHistory({
          fileId,
          fileName: activeFile?.name || "Untitled",
          language,
          status: "error",
          outputPreview: message,
          time: 0,
          memory: 0,
        });
      } else {
        const run = result.data?.run || result.run || {};
        const stdout = run.stdout || run.output || "";
        const stderr = run.stderr || "";
        const exitCode = run.code;
        const meta = {
          time: run.cpu_time || run.wall_time || 0,
          memory: run.memory || 0
        };
        let status: "success" | "error" = "success";
        let output = "";

        if (stderr) {
          output = stderr;
          status = "error";
        } else if (exitCode !== 0) {
          output = `Process exited with code ${exitCode}`;
          status = "error";
        } else if (stdout) {
          output = stdout;
        } else {
          output = "(No output)";
        }

        store.addOutput(fileId, output);
        store.setStatus(fileId, status);
        store.setMeta(fileId, meta);
        store.addRunHistory({
          fileId,
          fileName: activeFile?.name || "Untitled",
          language,
          status,
          outputPreview: output,
          ...meta,
        });
      }
    } catch (error: any) {
      const message = `Error: ${error.message}`;
      store.addOutput(fileId, message);
      store.setStatus(fileId, "error");
      store.addRunHistory({
        fileId,
        fileName: activeFile?.name || "Untitled",
        language,
        status: "error",
        outputPreview: message,
        time: 0,
        memory: 0,
      });
    }
  }
}

export const codeExecutor = new CodeExecutor();
