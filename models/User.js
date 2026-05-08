const { Schema, default: mongoose } = require("mongoose");

const User = new Schema(
  {
    firstName: { type: String, lowercase: true },
    lastName: { type: String, lowercase: true },
    email: { type: String, unique: true },
    password: { type: String, minLength: 8 },
    name: { type: String, lowercase: true },
    bvn: { type: String, unique: true, sparse: true },
    nin: { type: String, unique: true },
    dob: { type: String },
    kycType: { type: String, enum: ["bvn", "nin"] },
    kycID: { type: String, unique: true, sparse: true },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", User);
