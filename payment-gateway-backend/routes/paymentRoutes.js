const express = require("express");
const router = express.Router();
const {
  initiatePayment,
  checkPaymentStatus,
  getAllPayments,
} = require("../controllers/paymentController");

router.post("/initiate", initiatePayment);
router.get("/status/:transactionReference", checkPaymentStatus);
router.get("/all", getAllPayments);

module.exports = router;
