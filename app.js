const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRegisteration = require("./routes/userRegisteration");
const bankAccount = require("./routes/bankAccount");
const transferRoute = require("./routes/transferRoute");
const { getToken } = require("./utils/getToken");
dotenv.config();

const app = express();

app.use(express.json());

// app.use("/", (req, res) => {
//   res.status(200).json({ message: "server is active" });
// });



app.use("/api/account", userRegisteration);
app.use("/api/account", bankAccount);
app.use("/api/transfer", transferRoute);

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
