const express = require("express");
const accountController = require("../controllers/accountController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/initialize-bankaccount", accountController.initializeAccount);
router.get(
  "/details/:accountNumber",
  accountController.getAccountDetails,
);
router.get("/balance/:accountNumber", protect, accountController.getBalance);

module.exports = router;
