import mongoose from "mongoose";

export async function connectDB() {
  try {
    const db = await mongoose.connect(
      "mongodb+srv://andresc06:Gigi2514932$@wallet.di9lz.mongodb.net"
    );
  } catch (error) {
    console.error(error);
  }
}
