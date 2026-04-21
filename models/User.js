const { Schema, default: mongoose } = require("mongoose");

const User = new Schema(
  {
    name: { type: String, lowercase: true },
    email: { type: String, unique: true },
    password: { type: String, minLength: 8 },
  },
  { timestamps: true },
);

const User = mongoose.model("User", User);
module.exports = User;
