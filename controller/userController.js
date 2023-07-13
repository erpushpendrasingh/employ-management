const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.signup = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    let user = await User.findOne({
      email,
    });

    if (user) {
      return res.status(400).json({
        msg: "User Already Exists",
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const hashedConfirmPassword = bcrypt.hashSync(confirmPassword, 10);
    user = new User({
      email,
      password: hashedPassword,
      confirmPassword: hashedConfirmPassword,
    });

    await user.save();

    const payload = {
      user: {
        _id: user._id,
        userName: user.email,
      },
    };

    jwt.sign(
      payload,
      `${process.env.TOKEN_SECERET}`,
      {
        expiresIn: 10000,
      },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          email: user.email,
          token,
          msg: "User signup successfully",
        });
      }
    );
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(" email, password ", email, password);
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const originalPass = await bcrypt.compareSync(password, user?.password);

    if (!originalPass) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      {
        email,
      },
      `${process.env.TOKEN_SECERET}`,
      { expiresIn: "1d" }
    );

    res
      .status(200)
      .json({ email: email, accessToken, msg: "Login Successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
