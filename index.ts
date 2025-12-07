//Normal image processing without worker
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir } from "node:fs/promises";
import { Jimp } from "jimp";
import type ts from "typescript";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_DIR = path.join(__dirname, "normal-output");
async function ProcessImage(imagePath: string, filename: string) {
  try {
    console.time(" processing...");
    const subDirPath = path.join(
      OUTPUT_DIR,
      filename.split(".")[0] ?? filename
    ) as string;
    await mkdir(subDirPath, { recursive: true });
    const img = await Jimp.read(imagePath);

    img.resize({ w: 100 });
    const outputPath = path.join(subDirPath, "resized.jpg") as string;
    await img.write(outputPath);
    console.timeEnd(" processing...");
    console.log(`Processed ${filename} successfully.`);
  } catch (error) {
    console.error(`Error processing ${filename}.`, error);
    throw error;
  }
}

async function main() {
  try {
    const filePath = path.join(__dirname, "assets", "sample-image1.jpg");
    await ProcessImage(filePath, "sample-image1.jpg");
    console.log("Done ! Image processing completed.");
  } catch (error) {
    console.error("Main execution failed.", error);
    process.exit(1);
  }
}

main();
