import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import resumeRoutes from "./routes/resume";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5050);

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/api", resumeRoutes);

app.listen(PORT, () => {
  console.log(`ResumeBot API listening on http://localhost:${PORT}`);
});
