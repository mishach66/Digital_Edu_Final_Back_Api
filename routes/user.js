import express from "express";
import {
  login,
  register,
  addToCart,
  getUserInfo,
  getUserCart,
  refreshToken,
} from "../controllers/user.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/:id", getUserInfo);

router.get("/:id/cart", getUserCart);

router.post("/refresh", refreshToken);

router.post("/register", register);

router.post("/login", login);

router.put("/:id/cart", authMiddleware, addToCart);

export default router;
