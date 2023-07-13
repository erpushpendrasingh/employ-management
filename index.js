const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userController = require("./controller/userController");
const employeeController = require("./controller/employeeController");
const { EmployeeRouter } = require("./routes/employees");

dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

app.use(cors());
app.options("*", cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Homepage");
});

// Signup route
app.post("/signup", userController.signup);
// Login route
app.post("/login", userController.login);

app.use("/employees", EmployeeRouter);

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
