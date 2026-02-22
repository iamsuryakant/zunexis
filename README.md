# ⚡ Zunexis

> A modern, multi-tab, browser-based JavaScript playground with real-time execution streaming and sandboxed worker isolation.

Zunexis is a fast, secure, and extensible in-browser IDE built using Next.js App Router, Monaco Editor, Web Workers, and Zustand. It simulates a real execution environment while ensuring performance, safety, and scalability.

---

## 🚀 Overview

Zunexis is a JavaScript-first online IDE designed to:

- Execute user code safely inside the browser
- Stream console logs in real time
- Support asynchronous behavior
- Prevent infinite loops from crashing the UI
- Provide a clean, modern development experience

The system is built with scalability in mind and is structured to evolve into a full multi-language cloud execution platform.

---

## ✨ Features

### 🧠 Multi-Tab Execution
- Create unlimited tabs
- Each tab maintains independent:
  - Code
  - Output
  - Execution status
- Switch between tabs instantly

### ⚡ Real-Time Console Streaming
- Logs appear immediately
- Supports:
  - `console.log`
  - `console.error`
  - `console.warn`
  - `console.clear`
- Output streams live from Web Worker

### 🔒 Secure Execution Sandbox
- Every run spawns a new Web Worker
- No persistent execution process
- No DOM access
- No UI thread blocking

### ⏱ Execution Protection
- Hard 3-second timeout
- Infinite loop safe
- Log memory cap (1000 logs)
- Worker auto-termination

### 🔁 Async Support
- `setTimeout`
- `setInterval`
- Promises
- Async functions

### 🪟 Flexible Layout
- Resizable panels
- Console placement:
  - Bottom
  - Left
  - Right

### 🎨 Modern UI
- Light / Dark theme
- Shadcn UI components
- TailwindCSS styling
- Clean, minimal interface

---

## 🏗 Architecture Overview

Execution Flow:

User Code  
↓  
Monaco Editor  
↓  
Run Button  
↓  
New Web Worker (per execution)  
↓  
Live Log Streaming  
↓  
Zustand State Update  
↓  
Realtime Console Rendering  

### Execution Lifecycle

Each run:

1. Creates a fresh Web Worker
2. Executes user code in isolation
3. Streams logs in real time
4. Terminates immediately when finished
5. Force-kills after 3 seconds if still running

This prevents:

- UI freezing
- Memory overflow
- Infinite loops
- Zombie processes

---

## 🛠 Tech Stack

| Layer            | Technology |
|------------------|------------|
| Framework        | Next.js (App Router) |
| Editor           | Monaco Editor |
| State Management | Zustand |
| Styling          | TailwindCSS |
| UI Components    | Shadcn UI |
| Execution Engine | Web Workers |
| Icons            | Lucide |
| Language         | JavaScript (JS-first architecture) |

---

## 📂 Project Structure

```
app/
  layout.tsx
  page.tsx

components/
  editor/
    CodeEditor.tsx
    TabBar.tsx
  console/
    ExecutionConsole.tsx
  shell/
    ZunexisHeader.tsx
    AppShell.tsx

store/
  useExecutionStore.ts

public/
  codeWorker.js
```

---

## 🔐 Execution Safety Model

Zunexis uses a defensive execution strategy:

- Worker-based sandbox
- No global window access
- No DOM access
- Log cap to prevent memory overflow
- Timeout-based hard kill
- Worker recreated per execution

This ensures malicious or poorly written code does not break the UI.

---

## 🧪 Example Usage

### Simple Log

```js
console.log("Hello Zunexis 🚀")
```

### Async Example

```js
setTimeout(() => {
  console.log("Async works!")
}, 1000)
```

### Infinite Loop Protection

```js
while (true) {}
```

→ Automatically terminated after 3 seconds.

---

## ▶️ Getting Started

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/zunexis.git
cd zunexis
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run Development Server

```bash
npm run dev
```

### 4️⃣ Open in Browser

```
http://localhost:3000
```

---

## 🧠 Why Web Workers?

Web Workers allow:

- Parallel execution
- UI thread protection
- True sandbox isolation
- Safe process termination

This simulates real backend execution behavior directly in the browser.

---

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Multi-tab support
- ✅ JS execution sandbox
- ✅ Async support
- ✅ Execution timeout protection
- ✅ Streaming console
- ✅ Layout switcher

## 🔮 Future Vision

Zunexis is designed as a foundation for:

- Online coding platform
- Interview practice environment
- Competitive coding playground
- Secure remote execution service
- Cloud-based IDE infrastructure

The current JS-first architecture is intentionally built to scale toward a Docker-based backend execution model.

---

## 🧩 Design Philosophy

Zunexis focuses on:

- Simplicity
- Safety
- Performance
- Extensibility

Instead of building a bloated IDE, it builds a clean execution engine that can evolve into a scalable backend-powered system.

---

## 👨‍💻 Author

Suryakant Thakur (Full Stack Developer)

---

## 📄 License

MIT License

---

## ⭐ Support

If you like this project:

- ⭐ Star the repository
- 🐛 Open issues
- 💡 Suggest features
- 🤝 Contribute improvements

---

## 🏁 Final Note

Zunexis is not just a playground —  
it is a foundation for a future multi-language cloud IDE.

Stay tuned.