import { Product } from "../models/product.js";
import { Category } from "../models/category.js";

export const getMainProducts = async (req, res) => {
  try {
    const mainProducts = await Product.find({})
      .sort({ averageRating: "desc" })
      .limit(10);
    const categories = await Category.find({});
    return res.status(200).json({
      message: "Products retrieved successfully",
      products: mainProducts,
      categories,
    });
    // 10 yvelaze magali shefasebis mqone wamoige
  } catch (error) {
    console.log("error in getAllProducts", error);
    return res
      .status(500)
      .json({ message: "Internal server error", products: [] });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  const { page = 0, size = 10 } = req.query;
  try {
    let realPage = page - 1;
    const categoryProducts = await Product.find({ category })
      .skip(realPage * size)
      .limit(size);
    const allCategoryProducts = await Product.find({ category });
    console.log(
      "all category",
      allCategoryProducts,
      allCategoryProducts.length,
      Math.ceil(allCategoryProducts.length / size)
    );
    return res.status(200).json({
      message: `${category} products retrieved successfully`,
      products: categoryProducts,
      page: realPage,
      totalPages: Math.ceil(allCategoryProducts.length / size),
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong", products: [] });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById({ _id: id });
    return res.json({ message: "product retrieved successfully", product });
  } catch (error) {
    res.status(404).json({ message: error.message });
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
    const categoryExists = await Category.findOne({
      name: category,
    });
    if (!categoryExists) {
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
    console.log("updated product", updatedProduct);
    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export const rateProduct = async (req, res) => {
  const { productId, userId } = req.params;
  const { rating } = req.body;
  try {
    const product = await Product.findById({ _id: productId });
    // product.numberOfRatings += 1;
    // product.averageRating =
    //   (product.averageRating + rating) / product.numberOfRatings;
  } catch (error) {}
};

export const deleteProduct = async (req, res) => {
  const { id: _id } = req.params;
  try {
    const productExists = await Product.exists({ _id });
    if (productExists) {
      await Product.findByIdAndRemove(_id);

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
