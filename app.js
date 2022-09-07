import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

// routes
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/product.js";

dotenv.config();

const app = express();

// middlewares
// general middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
//stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded

// WHY ARE SAME TOKENS GENERATED

// route middlewares
app.use("/users", userRoutes);
app.use("/products", productRoutes);

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => {
      console.log(`server running on PORT=${PORT}`);
    });
  } catch (err) {
    console.log("error while starting", err);
  }
})();
