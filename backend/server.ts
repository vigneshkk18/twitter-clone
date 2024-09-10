import "express-async-errors";
import dotenv from "dotenv";

import express from "express";
import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import postRoutes from "./routes/post.routes";
import connectMongoDB from "./db/connectMongoDB";
import { protectRoute } from "./middlewares/protectRoute";
import errorHandlerMiddleware from "./middlewares/errorHandler";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", protectRoute, userRoutes);
app.use("/api/posts", protectRoute, postRoutes);

app.use(errorHandlerMiddleware);

async function startServer() {
  try {
    await connectMongoDB();
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
  } catch (error: any) {
    console.log(`Something went Wrong: ${error.message}`);
    process.exit(1);
  }
}

startServer();
