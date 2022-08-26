import { Product } from "../models/product.js";
import { Category } from "../models/category.js";

export const getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find({});
    const categories = await Category.find({});
    return res.status(200).json({
      message: "Products retrieved successfully",
      products: allProducts,
      categories,
    });
  } catch (error) {
    console.log("error in getAllProducts", error);
    // why 500
    return res
      .status(500)
      .json({ message: "Internal server error", products: [] });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  const { page = 0, size = 10 } = req.query;
  try {
    const categoryProducts = await Product.find({ category })
      .skip(page * size)
      .limit(size);

    return res.status(200).json({
      message: `${category} products retrieved successfully`,
      products: categoryProducts,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong", products: [] });
  }
};

export const createProduct = async (req, res) => {
  const {
    name,
    description,
    category,
    brand,
    price,
    releaseDate,
    specification,
  } = req.body;
  try {
    const newProduct = new Product({
      name,
      description,
      category,
      brand,
      price,
      releaseDate,
      specification,
    });
    const categoryExists = await Category.find({
      name: category,
    });
    if (!categoryExists.length) {
      const newCategory = new Category({ name: category });
      await newCategory.save();
    }
    const savedProduct = await newProduct.save();
    return res
      .status(201)
      .json({ message: "Product saved successfully", product: savedProduct });
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ message: "Bad request", error });
  }
};

export const updateProduct = async (req, res) => {
  const { id: _id } = req.params;
  const { product } = req.body;
  console.log("product before update", product);
  try {
    console.log("product from body", product);
    const updatedProduct = await Product.findOneAndUpdate({ _id }, product, {
      new: true,
    });
    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export const deleteProduct = async (req, res) => {
  const { id: _id } = req.params;
  try {
    const productExists = await Product.exists({ _id });
    if (productExists) {
      await Product.findByIdAndRemove(_id);
      // remove category if no product has it

      return res.status(200).json({ message: "Product deleted successfully" });
    } else {
      return res
        .status(404)
        .json({ message: `Product with id of ${_id} does not exists` });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};
