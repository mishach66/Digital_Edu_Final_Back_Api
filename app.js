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
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// WHY ARE SAME TOKENS GENERATED

// route middlewares
app.use("/users", userRoutes);
app.use("/products", productRoutes);

const PORT = process.env.PORT || 5000;

// ------------- ============   Cloud Mongo DB   ============ -------------
// (async () => {
//   try {
//     await mongoose.connect(process.env.MONGOOSE_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     app.listen(PORT, () => {
//       console.log(`server running on PORT=${PORT}`);
//     });
//   } catch (err) {
//     console.log("error while starting", err);
//   }
// })();
// ------------- ============   Cloud Mongo DB   ============ -------------


// ------------- ============   Local Mongo DB   ============ -------------
const DB_NAME = process.env.DB_NAME

async function start() {
  try {
      await mongoose.connect(
          `mongodb://127.0.0.1:27017/${DB_NAME}`,
      )
      app.listen(PORT, () => console.log(`Server started on port: ${PORT}`))
  } catch (error) {
      console.log(error)
  }
}
start()
// ------------- ============   Local Mongo DB   ============ -------------