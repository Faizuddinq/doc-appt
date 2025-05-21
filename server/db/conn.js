const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // optionally terminate app on DB failure
  }
};

module.exports = connectDB;
