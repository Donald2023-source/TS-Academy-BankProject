const Transaction = require("../models/Transaction");
const Account = require("../models/account");
const api = require("../utils/axiosInstance");
const jwt = require("jsonwebtoken");
exports.sendMoney = async (req, res) => {
  try {
    const { amount, recipientAccountNumber, senderAccountNumber } = req.body;

    if (!amount || !recipientAccountNumber || !senderAccountNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const senderAccount = await Account.findOne({
      accountNumber: senderAccountNumber,
    });
    const recieverAccount = await Account.findOne({
      accountNumber: senderAccountNumber,
    });
    console.log(senderAccount);

    if (!senderAccount) {
      return res.status(404).json({ message: "Sender account not found" });
    }

    const data = await api.post("/api/transfer", {
      from: senderAccountNumber,
      to: recipientAccountNumber,
      amount: amount,
    });

    const transactions = await Transaction.find().populate({
      path: "initiatedBy",
      select: "name email",
    });

    await Transaction.create({
      amount: amount,
      receiverAccount: recieverAccount?._id,
      senderAccount: senderAccount?._id,
      status: "pending",
      initiatedBy: senderAccount.customerId,
    });

    res.status(200).json({
      success: true,
      message: "Money sent successfully",
      data: data?.data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error sending money" });
  }
};

exports.getTransactionHistory = async (req, res) => {
  try {
    const { accountNumber } = req.body;
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    let userId;

    if (!userId && token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded?.id || decoded?._id || decoded?.userId;
      } catch (err) {
        console.error("JWT decode error:", err);
      }
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const userAccounts = await Account.find({ customerId: userId }).select(
      "_id accountNumber",
    );

    if (userAccounts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No account found for this user",
      });
    }

    const userAccountIds = userAccounts.map((acc) => acc._id);
    const userAccountNumbers = userAccounts.map((acc) => acc.accountNumber);

    if (accountNumber) {
      if (!userAccountNumbers.includes(accountNumber)) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to view this account's transactions",
        });
      }
    }

    const transactions = await Transaction.find()
      .populate({
        path: "senderAccount",
        select: "accountNumber",
      })
      .populate({
        path: "receiverAccount",
        select: "accountNumber",
      })
      .populate({
        path: "initiatedBy",
        select: "name email",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    console.error("Transaction History Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching transaction history",
    });
  }
};
