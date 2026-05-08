const express = require("express");
const accountController = require("../controllers/accountController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/create", accountController.createAccount);
router.post("/login", accountController.Login);

// router.post("/add-bvn", protect, accountController.addBVN);

module.exports = router;
