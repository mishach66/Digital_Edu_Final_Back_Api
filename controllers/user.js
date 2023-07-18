import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const {
    firstName: reqFirstName,
    lastName: reqLastName,
    email,
    password,
  } = req.body;

  try {
    const emailExists = await User.find({
      email,
    });
    if (emailExists.length) {
      throw new Error("email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName: reqFirstName,
      lastName: reqLastName,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    const { _id, firstName, lastName, role } = newUser;
    const { token, refreshToken } = generateToken(
      { _id, firstName, lastName, role },
      "1m",
      "7d"
    );
    return res.status(200).json({
      message: "Registered Succesfully!",
      token,
      refreshToken,
      user: savedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const {
      _id,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    } = existingUser;
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (isPasswordValid) {
      const { token, refreshToken } = generateToken(
        { _id, firstName, lastName, role },
        "1m",
        "7d"
      );
      return res.status(200).json({
        message: "logged in successfully",
        token,
        refreshToken,
        user: existingUser,
      });
    } else {
      return res.status(422).json({ message: "Password Or Email is invalid" });
    }
  } else {
    return res.status(404).json({ message: "User not found" });
  }
};

export const getUserInfo = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id });
    return res.json({ user, message: "user retrieved successfully" });
  } catch (error) {
    return res.status(404).json({ message: "user not found", user: null });
  }
};

export const getUserCart = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id });
    return res.json({
      message: "user cart retrieved successfully",
      cart: user.cart,
    });
  } catch (error) {
    res.json({ message: "error retrieving user cart", error });
  }
};

export const refreshToken = async (req, res) => {
  const { refresh_token } = req.body;

  try {
    const user = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
    if (!!user) {
      const { _id, role, firstName, lastName } = user;
      const { token } = generateToken(
        { _id, firstName, lastName, role },
        "1m",
        "7d"
      );
      res.json({ message: "token refreshed successfully", token });
    }
  } catch (err) {
    res.status(500).json({ message: "error refreshing token", err });
  }
};

export const addToCart = async (req, res) => {
  const { id } = req.params;
  const { products } = req.body;
  try {
    await User.findOneAndUpdate(
      { _id: id },
      {
        cart: products.map((product) => {
          const quantity = product.quantity;
          delete product.quantity;
          return { ...product, quantity };
        }),
      }
    );
    const updatedUser = await User.findOne({ _id: id });
    res.json({ message: "cart updated successfully", cart: updatedUser.cart });
  } catch (error) {
    res.status(400).json({ message: "error updating cart" });
  }
};
