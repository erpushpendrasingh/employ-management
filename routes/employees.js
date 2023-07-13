const express = require("express");
const EmployeeRouter = express.Router();
const Employee = require("../models/Employees");

EmployeeRouter.post("/add", async (req, res) => {
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
});

EmployeeRouter.get("/", async (req, res) => {
  try {
    let { firstName, department, sortBy, limit = 5, page = 1 } = req.query;

    if (department !== undefined) {
      department = department.toString();
    }

    let queries = {};

    if (firstName === undefined && department === undefined) {
      queries = {};
    } else if (firstName === undefined) {
      queries.department = { $regex: department, $options: "i" };
    } else if (department === undefined) {
      queries.firstName = { $regex: firstName, $options: "i" };
    } else if (firstName === undefined && department === undefined) {
      queries.department = { $regex: department, $options: "i" };
    } else if (department === undefined) {
      queries.firstName = { $regex: firstName, $options: "i" };
    } else {
      queries.department = { $regex: department, $options: "i" };
      queries.firstName = { $regex: firstName, $options: "i" };
    }

    let sorting = {};
    if (sortBy != undefined) {
      sorting[sortBy] = 1;
    }

    let employee = await Employee.find(queries)
      .sort(sorting)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCount = employee?.length;
    res.status(200).json({ data: employee, totalCount });
  } catch (err) {
    res.status(404).send({
      msg: "something wrong while getting employee",
    });
  }
});

EmployeeRouter.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  try {
    await Employee.findByIdAndUpdate({ _id: id }, payload, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).send({ msg: "Updated SUCCESSFULLY" });
  } catch (err) {
    console.log(err);
    res.status(404).send({ msg: "FAILED TO UPDATE THE DATA" });
  }
});
EmployeeRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  try {
    await Employee.findByIdAndDelete({ _id: id }, payload, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).send({ msg: "Deleted SUCCESSFULLY" });
  } catch (err) {
    console.log(err);
    res.status(404).send({ msg: "FAILED TO Delete" });
  }
});

module.exports = { EmployeeRouter };
