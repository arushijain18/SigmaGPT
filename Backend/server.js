import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import passport from "./config/passport.js"; 
import authRoutes from "./routes/auth.js";  

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: ["http://localhost:5173", "https://sigmagpt-frontend-53bq.onrender.com"],
  credentials: true
}));
app.use(express.json());         
app.use(passport.initialize());
app.use("/api/auth", authRoutes);
app.use("/api", chatRoutes);

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
  connectDB();
});

const connectDB = async()=>{
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected with Database!");
  }
  catch(err)
  {
    console.log("Failed to connect with the db",err);
  }
}