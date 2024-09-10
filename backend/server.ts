import "express-async-errors";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import connectMongoDB from "./db/connectMongoDB";
import errorHandlerMiddleware from "./middlewares/errorHandler";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

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
