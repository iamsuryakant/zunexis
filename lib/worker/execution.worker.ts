// Type definitions for the worker
interface ExecutionRequest {
  code: string;
  language: string;
  fileId: string;
}

interface ExecutionResponse {
  success: boolean;
  output: string[];
  error?: string;
  meta?: {
    time: number;
    memory: number;
  };
}

// Supported languages
const SUPPORTED_LANGUAGES = {
  javascript: {
    execute: (code: string): string[] => {
      try {
        // Capture console output
        const originalConsole = { ...console };
        const output: string[] = [];

        const mockConsole = {
          log: (...args: any[]) => output.push(args.map(arg => String(arg)).join(' ')),
          error: (...args: any[]) => output.push('ERROR: ' + args.map(arg => String(arg)).join(' ')),
          warn: (...args: any[]) => output.push('WARN: ' + args.map(arg => String(arg)).join(' ')),
          info: (...args: any[]) => output.push('INFO: ' + args.map(arg => String(arg)).join(' ')),
        };

        console.log = mockConsole.log.bind(originalConsole);
        console.error = mockConsole.error.bind(originalConsole);
        console.warn = mockConsole.warn.bind(originalConsole);
        console.info = mockConsole.info.bind(originalConsole);

        // Execute the code
        const result = new Function(code)();

        // Restore console
        console.log = originalConsole.log;
        console.error = originalConsole.error;
        console.warn = originalConsole.warn;
        console.info = originalConsole.info;

        if (result !== undefined) {
          output.push(`Result: ${String(result)}`);
        }

        return output;
      } catch (error) {
        return [`ERROR: ${error instanceof Error ? error.message : String(error)}`];
      }
    }
  },
  python: {
    execute: (code: string): string[] => {
      return ["Python execution not implemented yet in worker. Use a backend service."];
    }
  },
  java: {
    execute: (code: string): string[] => {
      return ["Java execution not implemented yet. Compile and run on server."];
    }
  },
  cpp: {
    execute: (code: string): string[] => {
      return ["C++ execution not implemented. Use compilation server."];
    }
  }
};

self.onmessage = function(event: MessageEvent<ExecutionRequest>) {
  const { code, language } = event.data;
  const startTime = performance.now();

  try {
    const languageHandler = SUPPORTED_LANGUAGES[language as keyof typeof SUPPORTED_LANGUAGES];

    if (!languageHandler) {
      throw new Error(`Language ${language} not supported`);
    }

    const output = languageHandler.execute(code);
    const endTime = performance.now();
    const executionTime = (endTime - startTime) / 1000;

    const response: ExecutionResponse = {
      success: true,
      output,
      meta: {
        time: parseFloat(executionTime.toFixed(2)),
        memory: 0 // Memory usage not available in worker
      }
    };

    self.postMessage(response);
  } catch (error) {
    const endTime = performance.now();
    const executionTime = (endTime - startTime) / 1000;

    const response: ExecutionResponse = {
      success: false,
      output: [],
      error: error instanceof Error ? error.message : String(error),
      meta: {
        time: parseFloat(executionTime.toFixed(2)),
        memory: 0
      }
    };

    self.postMessage(response);
  }
};