import express, { Request, Response } from "express";
import cors from "cors";
import { fetchStudents } from "./modules/students";

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: "*",
    methods: ["GET"],
    allowedHeaders: "*/",
  })
);
// Middleware to parse JSON
app.use(express.json());

// Sample route
app.get("/students", (req: Request, res: Response) => {
  fetchStudents().then((data) => {
    res.send(data);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
