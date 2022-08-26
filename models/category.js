import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
  name: String,
});

export const Category = mongoose.model("Category", categorySchema);
