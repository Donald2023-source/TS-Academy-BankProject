const { Schema, default: mongoose } = require("mongoose");
const Transaction = new Schema({
  ref: { type: String, unique: true },
}, {timestamps=true});

const Transaction = mongoose.model("Transaction", Transaction);
module.exports = Transaction;
