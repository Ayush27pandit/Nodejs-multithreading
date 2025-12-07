//Normal image processing without worker
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir, readdir } from "node:fs/promises";
import { Jimp } from "jimp";
import type ts from "typescript";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_DIR = path.join(__dirname, "normal-output");
const INPUT_DIR = path.join(__dirname, "assets");

async function ProcessImage(imagePath: string, filename: string) {
  try {
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
          console.log(`Resized ${filename} successfully.`);
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
          console.log(`medium Resized ${filename} successfully.`);
        },
      },

      {
        name: "blur",
        operation: async () => {
          const cloned = img.clone();
          cloned.blur(100);
          const outputPath = path.join(
            subDirPath,
            `blurred-${filename}`
          ) as string;
          await cloned.write(outputPath);
          console.log(`Blurred ${filename} successfully.`);
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
          console.log(`Greyscaled ${filename} successfully.`);
        },
      },
    ];

    for (const { name, operation } of task) {
      await operation();
    }
  } catch (error) {
    console.error(`Error processing ${filename}.`, error);
    throw error;
  }
}

async function main() {
  try {
    const files = await readdir(INPUT_DIR);

    //filtering the image files only
    const imgFiles = files.filter((file) =>
      /\.(jpg|png|jpeg|webp)$/i.test(file)
    );

    console.time("Processing time");
    for (const file of imgFiles) {
      const filePath = path.join(__dirname, "assets", file);
      await ProcessImage(filePath, file);
      console.log(`Image ${file} is processed successfully.`);
    }
    console.timeEnd("Processing time");
  } catch (error) {
    console.error("Main execution failed.", error);
    process.exit(1);
  }
}

main();
