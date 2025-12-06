import express, { Request, Response } from "express";

import initializeDB from "./config/db";

const app = express();

// middleware
app.use(express.json());

initializeDB();

app.get("/", (req: Request, res: Response) => {
  console.log("Rental app is running");
});

// app.use("/api/v1/auth");
// app.post('/api/v1/auth/signup', async(req, res)=>)

export default app;
