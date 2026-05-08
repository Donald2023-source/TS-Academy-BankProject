const User = require("../models/User");
const bcrypt = require("bcrypt");
const {
  validateBVN,
  createBVN,
  createBankAccount,
  createBankAccountNIBBS,
  accountDetails,
  getBalanceService
} = require("../services/createAccount");
const jwt = require("jsonwebtoken");
const api = require("../utils/axiosInstance");

async function createAccount(req, res) {
  try {
    const { email, password, firstName, lastName, bvn, dob, phone } = req.body;
    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      dob,
      bvn,
    });

    const bvnReg = bvn
      ? await createBVN(firstName, lastName, dob, phone, bvn)
      : null;

    if (bvnReg?.status === 409) {
      console.log("Something went wrong", bvnReg?.status);
    }

    const { password: _, ...userWithoutPassword } = user.toObject();
    const token = jwt.sign(
      {
        id: user?._id,
        email: user?.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    res.status(201).json({
      message: "user created successfully",
      status: 201,
      success: true,
      data: userWithoutPassword,
      token: token,
      bvnReg: bvnReg,
    });
  } catch (error) {
    console.error(error);
  }
}

async function addBVN(req, res) {
  try {
    const { bvn, firstName, lastName, dob, phone } = req?.body;
    const userId = req.user?.id || getUserIdFromToken(req);

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!bvn || !firstName || !lastName || !dob || !phone) {
      return res.status(400).json({ message: "All fields required" });
    }

    await User.findByIdAndUpdate(userId, { bvn, dob, phone });

    const data = await createBVN(firstName, lastName, dob, phone, bvn);

    return res.status(200).json({
      userId: userId,
      data: data,
      message: "Added successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error adding BVN" });
  }
}

async function initializeAccount(req, res) {
  try {
    const { kycID, kycType, dob, userId } = req.body;
    if (!kycID || !kycType || !dob || !userId) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.find({ userId });
    const data = await createBankAccountNIBBS(kycType, kycID, dob, userId);
    return res
      .status(200)
      .json({ message: "Account initialized successfully", data: data });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error initializing account", error: err.message });
  }
}

async function getAccountDetails(req, res) {
  try {
    const { accountNumber } = req.params;
    const data = await accountDetails(accountNumber);
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching account details" });
  }
}

async function getBalance(req, res){
  try {
    const { accountNumber } = req.params;
    const data = await getBalanceService(accountNumber);
    return res.status(200).json({ balance: data });
  } catch(err) {
     console.log(err);
    return res.status(500).json({ message: "Error fetching account details" });
  }
}

async function Login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      success: true,
      message: "Login successful",
      status: 200,
      data: userWithoutPassword,
      token: token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
}

module.exports = {
  createAccount,
  addBVN,
  initializeAccount,
  getAccountDetails,
  Login,
  getBalance,
};
