import express from "express";
import cors from "cors";
import "dotenv/config";
import apiRouter from "./routes/apiRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = [
  "https://prep-io-qnvm.onrender.com/",
  "http://localhost:5173",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ msg: "Backend is running" });
});

app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log("Server running on port : ", PORT);
});
