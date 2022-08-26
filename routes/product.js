import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductsByCategory,
  updateProduct,
} from "../controllers/products.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", getAllProducts);

router.get("/category/:category", getProductsByCategory);

router.post("/", createProduct);

router.put("/:id", authMiddleware, roleMiddleware, updateProduct);

router.delete("/:id", authMiddleware, roleMiddleware, deleteProduct);

export default router;
