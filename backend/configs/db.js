import mongoose from 'mongoose';

const connectDB = async () => {
  mongoose.set('strictQuery', false);
  const conn = await mongoose.connect(process.env.MONGO_URL);

  console.log(`MongoDB connected: ${conn.connection.host}`);
};

export default connectDB;
