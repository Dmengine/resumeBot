import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import resumeRoutes from "./routes/resume"


dotenv.config()

const app = express()
const PORT = Number(process.env.PORT || 5001);

app.use(cors())
app.use(express.json({ limit: "1mn"}))

// const messageContent = AuthenticatorResponse.data?.choices?.[0]?.message?.content
// if(!messageContent || typeof messageContent !== "string") {
//     console.error('AI provider returned an empty response. Please try again later.');
// }

app.get("/", (req, res) => {
    res.json({ message: `Server is running on port ${PORT}` });
});

app.use("/api", resumeRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})