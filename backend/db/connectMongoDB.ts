import mongoose from "mongoose";

const connectMongoDB = async () => {
  if (!process.env.MONGO_URI) throw new Error("Mongo URI not found...");
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB connected: ${conn.connection.host}`);
};

export default connectMongoDB;
