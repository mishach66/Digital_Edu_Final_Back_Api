import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  releaseDate: { type: Date },
  specification: [{ name: String, value: String }],
  averageRating: { type: Number, default: 1 },
  ratings: [{ user: mongoose.Schema.Types.ObjectId, rating: Number }],
});

export const Product = mongoose.model("Product", productSchema);
