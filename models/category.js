import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
  categories: [String],
});

export const Category = mongoose.model("Category", categorySchema);
