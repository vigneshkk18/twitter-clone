import express from "express";
import authRoutes from "./routes/auth.routes";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongoDB";

dotenv.config();

const app = express();

app.use("/api/auth", authRoutes);

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
