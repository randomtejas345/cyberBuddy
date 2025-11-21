// index.js
import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());           // <-- builtin, replaces body-parser
app.use(express.urlencoded({ extended: true }));

app.use("/api/chat", chatRoutes);
app.get("/login",(req,res)=>{
    res.send("Hello Nishant!")
})

const PORT = process.env.PORT || 5000;
app.listen(PORT,"0.0.0.0", () => console.log(`✅ Server running on port ${PORT}`));
