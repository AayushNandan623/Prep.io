import express from "express";
import cors from "cors";
import "dotenv/config";
import apiRouter from "./routes/apiRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ msg: "Backend is running" });
});

app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log("Server running on port : ", PORT);
});
