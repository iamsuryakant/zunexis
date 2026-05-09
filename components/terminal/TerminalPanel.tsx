"use client"

import { useEffect, useRef, useState } from "react"

export default function TerminalPanel() {
  const terminalRef = useRef<HTMLDivElement>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [logs])

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()

    // Add command to logs
    setLogs(prev => [...prev, `$ ${cmd}`])

    // Simulated responses for demo
    const responses: Record<string, string> = {
      'ls': 'src/\ncomponents/\npackage.json\nREADME.md',
      'pwd': '/workspace/zunexis',
      'date': new Date().toString(),
      'whoami': 'user',
      'help': 'Available commands: ls, pwd, date, whoami, clear, help, echo',
      'clear': '__CLEAR__',
    }

    if (trimmed === 'clear') {
      setLogs([])
      return
    }

    if (trimmed.startsWith('echo ')) {
      setLogs(prev => [...prev, trimmed.slice(5)])
      return
    }

    if (responses[trimmed]) {
      setLogs(prev => [...prev, responses[trimmed]])
    } else if (trimmed) {
      setLogs(prev => [...prev, `command not found: ${cmd}`])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      executeCommand(input)
    }
    setInput("")
  }

  return (
    <div className="flex flex-col h-full bg-black text-green-400 font-mono text-[12px]">
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#1a1a1a] border-b border-white/10">
        <span className="text-[10px] text-white/50 uppercase tracking-wider">Terminal</span>
        <button
          onClick={() => setLogs([])}
          className="text-[10px] text-white/40 hover:text-white/70 transition-colors"
        >
          clear
        </button>
      </div>

      <div ref={terminalRef} className="flex-1 overflow-y-auto p-3">
        <div className="text-white/60 mb-2">Welcome to Zunexis Terminal</div>
        <div className="text-white/40 text-[10px] mb-4">Type 'help' for available commands</div>

        {logs.map((log, i) => (
          <div key={i} className="whitespace-pre-wrap py-0.5">{log}</div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center px-3 py-2 border-t border-white/10 bg-[#1a1a1a]">
        <span className="text-green-400 mr-2">❯</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a command..."
          className="flex-1 bg-transparent text-white/90 outline-none placeholder:text-white/30"
          autoFocus
        />
      </form>
    </div>
  )
}