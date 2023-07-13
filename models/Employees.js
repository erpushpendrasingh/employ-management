const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  department: {
    type: String,
    enum: ["Tech", "Marketing", "Operations"],
    default: "Tech",
  },
  salary: { type: Number },
  email: { type: String, required: true, unique: true },
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
