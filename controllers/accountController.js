const User = require("../models/User");
const bcrypt = require("bcrypt");
async function Signup(req, res) {
  try {
    const { email, password, name } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }
    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, password: hash, name });
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(201).json({
      message: "user created successfully",
      status: 201,
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
  }
}


async function Login(req, res) {
    
}
module.exports = Signup;
