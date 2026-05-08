const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const account = new Schema(
  {
    accountName: {
      type: String,
      // required: true,
    },
    customerId: {
      type: String,
      unique: true,
    },
    accountNumber: {
      type: String,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    bankCode: {
      type: String,
    },
  },
  { timeStamps: true },
);

const Account = mongoose.model("Account", account);
module.exports = Account;
