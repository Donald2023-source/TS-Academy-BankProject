const { Schema, default: mongoose } = require("mongoose");
const Transaction = new Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    initiatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    senderAccount: [
      {
        type: Schema.Types.ObjectId,
        ref: "Account",
      },
    ],
    receiverAccount: [
      {
        type: Schema.Types.ObjectId,
        ref: "Account",
      },
    ],
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Transaction", Transaction);
