# Node.js Multithreading Through Image Processing

This project demonstrates how to use **Node.js Worker Threads** to process images in parallel. By offloading CPU-heavy operations (resize, blur, greyscale) to worker threads, the main thread stays responsive and throughput improves.

---

## Performance Benchmark

| Mode                   | Time Taken    |
| ---------------------- | ------------- |
| Without Worker Threads | ~3.69 seconds |
| With Worker Threads    | ~1.84 seconds |

Parallel execution nearly **doubles the performance**, while keeping the main thread free.

---

## What You Will Learn

- How Node.js Worker Threads work
- How to send data between main → worker → main
- Why CPU-heavy tasks block the event loop
- How multithreading avoids blocking
- How parallel execution improves performance
- Real-world use case: image processing pipeline

---

## Features

- Parallel image processing
- Four operations per image:
  - 100×100 resize
  - 200×200 resize
  - Blur
  - Greyscale
- Per-image processing time (in seconds)
- Independent workers running on separate threads
- Safe communication between threads
- Automatic directory creation for output files

---

## Project Structure

Below is the repository structure in Markdown format. It reflects the current workspace layout and highlights important files and folders.

```
Nodejs-multithreading/
├─ index.ts                 # Main thread (single-threaded processing / demo)
├─ multithreading.ts        # Main thread that dispatches work to workers
├─ worker.ts                # Worker thread implementation (image ops)
├─ package.json             # Project metadata + scripts
├─ tsconfig.json            # TypeScript configuration
├─ README.md                # Project readme (this file)
├─ assets/                  # Input files (images, test data)
│  └─ hi.txt                # example asset
├─ comparison-normal/       # Reference/expected outputs for comparison
│  ├─ sample-image1/
│  ├─ sample-image-2/
│  └─ ...
├─ normal-output/           # Output produced by single-thread (non-worker) run
│  ├─ sample-image1/
│  ├─ sample-image-2/
│  └─ ...
└─ worker-output/           # Output produced by worker-threaded run
   ├─ sample-image1/
   ├─ sample-image-2/
   └─ ...
```

**Key files:**

- `index.ts`: Main entry that runs processing without worker threads (useful for baseline benchmarks).
- `multithreading.ts`: Entry that creates worker threads and distributes image processing tasks.
- `worker.ts`: Worker implementation — receives tasks from the main thread and performs image operations.
- `assets/`: Place input images here for processing.
- `normal-output/` and `worker-output/`: Generated outputs for single-thread and multithread runs respectively.

---

## Quick Start (PowerShell)

- Install dependencies (if using `bun`):

```powershell
bun install
```

- Run the single-threaded demo:

```powershell
bun index.ts
```

- Run the multithreaded demo:

```powershell
bun multithreading.ts
```

Notes:

- If you prefer `ts-node`/`node`, transpile or run with an appropriate runner (e.g., `ts-node`), or compile with `tsc` and run `node dist/index.js`.
- Output directories (`normal-output/` and `worker-output/`) are created automatically by the scripts when needed.

---
