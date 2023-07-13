const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("conn db");
  } catch (err) {
    console.log(err);
  }
};
module.exports = connectDB;
