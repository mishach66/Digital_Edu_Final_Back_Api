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
      await newUser.save();
      const { _id, firstName, lastName, role } = newUser;
      const { token, refreshToken } = generateToken(
        { _id, firstName, lastName, role },
        "30m",
        "7d"
      );
      return res
        .status(200)
        .json({ message: "Registered Succesfully!", token, refreshToken });
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
      return res
        .status(200)
        .json({ message: "logged in successfully", token, refreshToken });
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
