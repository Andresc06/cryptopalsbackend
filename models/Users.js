import mongoose from "mongoose";

// Schema for the user registration
const registerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  wallet: {
    type: Array,
    default: [],
  },
  payments: {
    type: Array,
    default: [],
  },
  deposits: {
    type: Array,
    default: [],
  },
  phone: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  // Add temporary code when doing transactions
  temp: {
    type: Number,
  },
});

export default mongoose.model("Users", registerSchema);
