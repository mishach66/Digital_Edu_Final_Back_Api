import { Product } from "../models/product.js";
import { Category } from "../models/category.js";

export const queryProducts = async (req, res) => {
  const { name } = req.query;
  try {
    const filtered = await Product.find({
      name: { $regex: name, $options: "i" },
    });
    res.status(200).json({ products: filtered });
  } catch (err) {
    res.status(500).json({ message: "Error searching for products", err });
  }
};

export const getMainProducts = async (req, res) => {
  const { page = 0, size = 10, sort = "name,desc" } = req.query;
  const [name, order] = sort.split(",");
  try {
    let realPage = page - 1;
    const mainProducts = await Product.find({});
    // .sort({
    //   [name]: order === "asc" ? 1 : -1,
    // })
    // .skip(realPage * size)
    // .limit(size);
    const categories = await Category.find({});
    const allProducts = await Product.find({});
    return res.status(200).json({
      message: "Products retrieved successfully",
      products: mainProducts,
      // page: realPage,
      categories,
      // totalPages: Math.ceil(allProducts.length / size),
    });
  } catch (error) {
    return res.status(500).json({
      message: "error getting home page products",
      products: [],
      error,
    });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  const { page = 0, size = 10, sort = "" } = req.query;
  const [name, order] = sort.split(",");
  try {
    let realPage = page - 1;
    const categoryProducts = await Product.find({ category })
      .sort({ [name]: order === "asc" ? 1 : -1 })
      .skip(realPage * size)
      .limit(size);
    const allCategoryProducts = await Product.find({ category });
    return res.status(200).json({
      message: `${category} products retrieved successfully`,
      products: categoryProducts,
      page: realPage,
      totalPages: Math.ceil(allCategoryProducts.length / size),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error getting category products",
      products: [],
      error,
    });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById({ _id: id });
    return res.json({ message: "product retrieved successfully", product });
  } catch (error) {
    res.status(404).json({ message: "error getting single product", error });
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
    image,
  } = req.body.product || {};
  try {
    const newProduct = new Product({
      name,
      description,
      category,
      brand,
      price,
      releaseDate,
      specification,
      image,
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
    return res.status(400).json({ message: "Bad request", error });
  }
};

export const updateProduct = async (req, res) => {
  const { id: _id } = req.params;
  const { product } = req.body;
  const { category } = product;
  try {
    const categoryExists = await Category.findOne({
      name: category,
    });
    if (!categoryExists) {
      const newCategory = new Category({ name: category });
      await newCategory.save();
    }
    const updatedProduct = await Product.findOneAndUpdate({ _id }, product, {
      new: true,
    });
    // const categoryProducts = await Product.find({ category });
    // if (categoryProducts.length === 0) {
    //   await Product.findOneAndDelete({ name: category });
    // }
    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(400).json({ message: "error updating product", error });
  }
};

// export const rateProduct = async (req, res) => {
//   const { productId, userId } = req.params;
//   const { rating } = req.body;
//   try {
//     const product = await Product.findById(productId);
//     const userRatings = product.ratings;
//     const existingUserRating = userRatings?.find((ur) => {
//       return ur.user.toString() === userId;
//     });
//     if (existingUserRating) {
//       existingUserRating.rating = rating;
//     } else {
//       userRatings.push({ user: userId, rating });
//     }
//     const recalculatedAverage =
//       userRatings.reduce((a, b) => {
//         return a + b.rating;
//       }, 0) / userRatings.length;
//     await Product.findOneAndUpdate(
//       { _id: productId },
//       { ratings: userRatings, averageRating: recalculatedAverage }
//     );

//     return res.status(200).json({ message: "Successfully rated" });
//   } catch (error) {
//     res.status(500).json({ message: "something went wrong", error });
//   }
// };

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
    return res.status(500).json({ message: "error deleting product", error });
  }
};
