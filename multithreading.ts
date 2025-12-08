import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Worker } from "node:worker_threads";
import { threadId } from "node:worker_threads";
import { performance } from "node:perf_hooks";

const __filename = fileURLToPath(import.meta.url); //getting current file path which is C:\Users\user\backend\multithreading.ts (assume this is current file path)

const __dirname = path.dirname(__filename); //now ditname extract path till directory means, is path(__filename) is C:\Users\user\backend\multithreading.ts then __dirname will be C:\Users\user\backend

const workerFilePath = path.join(__dirname, "worker.ts"); // join is use to concatenate dirname and the file name passed(worker.ts) so path will be C:\Users\user\backend\worker.ts

const INPUT_DIR = path.join(__dirname, "assets");

console.log("Main Thread ID:", threadId);
function RunWorker(imagePath: string, filename: string) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(workerFilePath);

    worker.postMessage({ imagePath, filename });

    worker.on("message", (data) => {
      console.log("Main received data: ", data);
      resolve(data);
    });
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

async function main() {
  try {
    const start = performance.now();
    const files = await readdir(INPUT_DIR);

    const imgFiles = files.filter((file: string) =>
      /\.(jpg|png|jpeg|webp)$/i.test(file)
    );

    //Use Worker Pool instead of creating multiple threads
    const ImagePromises = imgFiles.map(async (file) => {
      const imagePath = path.join(INPUT_DIR, file);
      const data = await RunWorker(imagePath, file);
      return data;
    });

    await Promise.all(ImagePromises);

    const end = performance.now();
    const timeTaken = (end - start) / 1000;

    console.log(
      `---------------\nProcessing time using Worker: ${timeTaken} s`
    );
  } catch (error) {
    console.error("Main multi-threading execution failed.", error);
    process.exit(1);
  }
}

main();

//SImple fibonaci example with thread id
// import path from "node:path";
// import { fileURLToPath } from "node:url";
// import { Worker, threadId } from "node:worker_threads";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const workerFilePath = path.join(__dirname, "worker.ts");

// function runHeavyOnMainThread() {
//   console.time("Main Thread Fibonacci");
//   const result = fibonacci(45); // CPU heavy
//   console.timeEnd("Main Thread Fibonacci");
//   console.log("Main thread result:", result);
// }

// function fibonacci(n: number): number {
//   return n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2);
// }

// function runHeavyOnWorker() {
//   console.log("\nMain Thread ID:", threadId);
//   console.log("Starting worker…");

//   const worker = new Worker(workerFilePath);

//   worker.on("message", (msg) => {
//     console.log("Main received:", msg);
//   });

//   worker.on("exit", (code) => {
//     console.log("Worker exited with code:", code);
//   });
// }

// async function main() {
//   console.log("----- RUNNING IN MAIN THREAD -----");
//   runHeavyOnMainThread();

//   console.log("\n----- RUNNING IN WORKER THREAD -----");
//   runHeavyOnWorker();

//   // Show main thread is still free
//   setInterval(() => console.log("Main thread still responsive…"), 500);
// }

// main();
