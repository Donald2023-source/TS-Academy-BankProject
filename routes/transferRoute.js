const express = require("express");
const transferController = require("../controllers/transferController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, transferController.sendMoney);
router.post("/history", protect, transferController.getTransactionHistory);
module.exports = router;