import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import chatbotRoutes from "./routes/chatbot.route.js";
import { loadBotResponses } from "./utils/loadBotResponses.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 4002;

app.use(express.json());
app.use(cors({
  origin: "https://chatbott-wine.vercel.app/" // <-- your frontend domain here
}));

async function startServer() {
  try {
    await loadBotResponses();
    console.log("Bot responses loaded.");

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    app.use("/bot/v1/", chatbotRoutes);

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
