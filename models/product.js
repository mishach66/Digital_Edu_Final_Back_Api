import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: mongoose.Schema.Types.Decimal128, required: true },
  releaseDate: { type: Date },
  specification: [{ name: String, value: String }],
});

export const Product = mongoose.model("Product", productSchema);
