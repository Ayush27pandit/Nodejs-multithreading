import express from "express";
import type { Request, Response } from "express";

const app = express();
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  console.log("Request started...");

  console.time("Request duration");

  let sum = 0;
  for (let i = 0; i < 1e9; i++) {
    // <-- REAL CPU BLOCKING
    sum += i;
  }

  console.timeEnd("Request duration");

  res.send("Done!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
