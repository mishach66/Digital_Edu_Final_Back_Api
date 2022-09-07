import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

export const register = async (req, res) => {
  const {
    firstName: reqFirstName,
    lastName: reqLastName,
    email,
    password,
  } = req.body;
  if (false) {
    // validate here
    return res.status(422).json({ message: "required fields are missing" });
  } else {
    // if email already exists?
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
      // demnamikava22@gmail.com
      //1234567
      const savedUser = await newUser.save();
      const { _id, firstName, lastName, role } = newUser;
      const { token, refreshToken } = generateToken(
        { _id, firstName, lastName, role },
        "30m",
        "7d"
      );
      return res.status(200).json({
        message: "Registered Succesfully!",
        token,
        refreshToken,
        user: savedUser,
      });
    } catch (error) {
      console.log("error", error);
      return res.status(500).json({ message: error.message });
    }
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
        "1d",
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

  //   try {
  //     const existingUser = await User.findOne({ email });
  //     if (existingUser) {
  //       console.log("existing user");
  //       const {
  //         _id,
  //         firstName,
  //         lastName,
  //         email,
  //         password: hashedPassword,
  //         role,
  //       } = existingUser;
  //       const isPasswordValid = await bcrypt.compare(password, hashedPassword);
  //       if (isPasswordValid) {
  //         const { token, refreshToken } = generateToken(
  //           { _id, firstName, lastName, email, role },
  //           "1d",
  //           "7d"
  //         );
  //         return res
  //           .status(200)
  //           .json({ message: "logged in successfully", token, refreshToken });
  //       } else {
  //         throw new Error("password or email is invalid");
  //         // return res
  //         //   .status(422)
  //         //   .json({ message: "Password Or Email is invalid" });
  //       }
  //     } else {
  //       throw new Error("password or email is invalid");
  //       // return res.status(404).json({ message: "User not found" });
  //     }
  //   } catch (error) {
  //     return res.json({ error, name: "hi" });
  //   }
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
    res.json({ message: "something went wrong" });
  }
};

export const refreshToken = async (req, res) => {
  const { refresh_token } = req.body;
};

export const addToCart = async (req, res) => {
  const { id } = req.params;
  const { products } = req.body;
  try {
    await User.findOneAndUpdate({ _id: id }, { cart: products });
    const updatedUser = await User.findOne({ _id: id });
    console.log("updated user", updatedUser);
    res.json({ message: "cart updated successfully", cart: updatedUser.cart });
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
};

export const review = async (req, res) => {};
