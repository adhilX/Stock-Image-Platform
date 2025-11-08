import express from "express";      
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes";
import imageRouter from "./routes/image.routes";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from "./config/database";
import { BASE_PATHS } from "./constants/routes";
dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
connectDB();
app.use(cors({ 
    origin: process.env.ORIGIN,
    credentials: true 
}));

app.use(BASE_PATHS.AUTH, authRouter);
app.use(BASE_PATHS.IMAGE, imageRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
  