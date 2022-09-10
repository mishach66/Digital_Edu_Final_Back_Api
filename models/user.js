import mongoose from "mongoose";
import { productSchema } from "./product.js";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, requeired: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  cart: [{ product: {}, quantity: Number }],
  role: { type: [String], default: ["user"] },
});

export const User = mongoose.model("User", userSchema);
