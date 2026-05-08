const { default: mongoose } = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to mongoDB");
  } catch (err) {
    console.error("Error connecting to database", err);
  }
};

module.exports = connectDB;

