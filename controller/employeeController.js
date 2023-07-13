const Employee = require("../models/Employees");
const dotenv = require("dotenv");
dotenv.config();

exports.add = async (req, res) => {
  try {
    const { firstName, lastName, department, salary, email } = req.body;

    let user = await Employee.findOne({
      email,
    });

    if (user) {
      return res.status(400).json({
        msg: "Employee Already Exists",
      });
    }

    user = new Employee({
      email,
      firstName,
      lastName,
      department,
      salary,
    });

    await user.save();

    return res.status(201).json({
      email,
      msg: "Employee created successfully",
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
