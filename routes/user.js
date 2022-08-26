import express from "express";
import { login, register, addToCart } from "../controllers/user.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", (req, res) => {});

router.post("/register", register);

router.post("/login", login);

router.put("/:id/cart", authMiddleware, addToCart);

export default router;
