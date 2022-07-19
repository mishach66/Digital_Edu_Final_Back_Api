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
  if (!reqFirstName || !reqLastName || !email || !password) {
    res.status(422).json({ message: "fields are missing" });
  } else {
    // if email already exists?
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        firstName: reqFirstName,
        lastName: reqLastName,
        email,
        password: hashedPassword,
      });
      await newUser.save();
      const { _id, firstName, lastName, role } = newUser;
      const { token, refreshToken } = generateToken(
        { _id, firstName, lastName, role },
        "30m",
        "7d"
      );
      res
        .status(200)
        .json({ message: "Registered Succesfully!", token, refreshToken });
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ message: "Oops... Something went wrong" });
    }
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({ message: "fields are missing" });
    return;
  }
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
        "30m",
        "7d"
      );
      res
        .status(200)
        .json({ message: "logged in successfully", token, refreshToken });
      return;
    } else {
      res.status(422).json({ message: "Password is invalid" });
      return;
    }
  } else {
    res.status(404).json({ message: "User not found" });
    return;
  }
};
