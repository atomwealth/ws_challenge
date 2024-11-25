import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
const jwt = require("jsonwebtoken");
import { fetchStudents } from "./modules/students";

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);
// Middleware to parse JSON
app.use(express.json());

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "demo" && password === "demo") {
    const token = jwt.sign({ username: username }, "WORLDSENSING CHALLENGE");
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(403).json({ message: "Access Denied. No token provided." });
    return;
  }

  jwt.verify(token, "WORLDSENSING CHALLENGE", (err: any, data: any) => {
    if (err) {
      res.status(403).json({ message: "Invalid token." });
      return;
    }
    next();
  });
}

// getStudents and fraud analysis
app.get("/students", authenticateJWT, (req: Request, res: Response) => {
  fetchStudents().then((data) => {
    res.send(data);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
