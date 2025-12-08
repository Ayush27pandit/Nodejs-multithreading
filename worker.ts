import { parentPort, threadId } from "node:worker_threads";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir, readdir } from "node:fs/promises";
import { Jimp } from "jimp";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_DIR = path.join(__dirname, "worker-output");
const INPUT_DIR = path.join(__dirname, "assets");
async function ProcessImage(imagePath: string, filename: string) {
  try {
    console.log("\nWorker started on Thread ID:", threadId);
    const subDirPath = path.join(
      OUTPUT_DIR,
      filename.split(".")[0] ?? filename
    ) as string;

    await mkdir(subDirPath, { recursive: true });
    const img = await Jimp.read(imagePath);

    const task = [
      {
        name: "small-resize",
        operation: async () => {
          const cloned = img.clone();
          cloned.resize({ w: 100, h: 100 });
          const outputPath = path.join(
            subDirPath,
            `resized-${filename}`
          ) as string;
          await cloned.write(outputPath);
        },
      },

      {
        name: "medium-resize",
        operation: async () => {
          const cloned = img.clone();
          cloned.resize({ w: 200, h: 200 });
          const outputPath = path.join(
            subDirPath,
            `medium-resized-${filename}`
          ) as string;
          await cloned.write(outputPath);
        },
      },

      {
        name: "blur",
        operation: async () => {
          const cloned = img.clone();
          cloned.blur(10);
          const outputPath = path.join(
            subDirPath,
            `blurred-${filename}`
          ) as string;
          await cloned.write(outputPath);
        },
      },
      {
        name: "greyscale",
        operation: async () => {
          const cloned = img.clone();
          cloned.greyscale();
          const outputPath = path.join(
            subDirPath,
            `greyscale-${filename}`
          ) as string;
          await cloned.write(outputPath);
        },
      },
    ];

    for (const { name, operation } of task) {
      await operation();

      console.log(
        `Worker thread ${threadId} processed ---> ${name} processed successfully.`
      );
    }
    return { filename, status: "done", threadId };
  } catch (err) {
    return {
      filename,
      status: "error",
      threadId,
      error: (err as Error).message,
    };
  }
}

parentPort?.on("message", async ({ imagePath, filename }) => {
  console.log("Worker received data: ", { imagePath, filename });
  // Safety: skip non-image files
  if (!/\.(jpg|jpeg|png|webp)$/i.test(filename)) {
    parentPort?.postMessage({
      filename,
      status: "skipped",
      reason: "Not an image",
      threadId,
    });
    return;
  }
  const result = await ProcessImage(imagePath, filename);
  parentPort?.postMessage(result);
});

//Fibonacci example with thread id
// import { parentPort, threadId } from "node:worker_threads";

// console.log("Worker Thread ID:", threadId);

// console.time("Worker Fibonacci");
// const result = fibonacci(45);
// console.timeEnd("Worker Fibonacci");

// if (parentPort != null) {
//   parentPort.postMessage({
//     threadId,
//     result,
//   });
// }

// function fibonacci(n: number): number {
//   return n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2);
// }
