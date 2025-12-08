# Node.js Multithreading Through Image Processing

This project demonstrates how to use **Node.js Worker Threads** to process images in parallel.  
By offloading CPU-heavy operations (resize, blur, greyscale) to worker threads, we achieve a significant performance boost.

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

assets/ # Input images
worker-output/ # Output directory created automatically
index.ts # Main thread - sends tasks to workers
worker.ts # Worker thread - performs image operations

---

## 📦 Installation

```yaml
bun install
```

## Running Project

- Without worker

```yaml
bun index.ts
```

- With worker threads(remember to change package.json module file)

```yaml
bun multithreading.ts
```
