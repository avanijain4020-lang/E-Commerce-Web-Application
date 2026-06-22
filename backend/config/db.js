import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let useJsonDb = false;

export const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn('\x1b[33m%s\x1b[0m', '⚠️ WARNING: MONGO_URI is not defined in .env. Falling back to local JSON database.');
    useJsonDb = true;
    return { useJsonDb: true };
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
    });
    console.log(`\x1b[32m%s\x1b[0m`, `🚀 MongoDB Connected: ${conn.connection.host}`);
    useJsonDb = false;
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn('\x1b[33m%s\x1b[0m', '⚠️ Failing back to local JSON database.');
    useJsonDb = true;
    return { useJsonDb: true };
  }
};

export const getUseJsonDb = () => {
  // If MONGO_URI is not set, force JSON DB mode
  if (!process.env.MONGO_URI) return true;
  return useJsonDb;
};
