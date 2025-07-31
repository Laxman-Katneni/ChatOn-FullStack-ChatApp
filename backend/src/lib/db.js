import mongoose from "mongoose";

export const connect_db = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB is connected: ${connection.connection.host}`);
  } catch (err) {
    console.log("MongoDB connection error: " + err);
  }
};
