const express = require("express");
const router = express.Router();
const {
  initiatePayment,
  checkPaymentStatus,
  getAllPayments,
  filterByDate,
} = require("../controllers/paymentController");

router.post("/initiate", initiatePayment);
router.get("/status/:transactionReference", checkPaymentStatus);
router.get("/all", getAllPayments);
router.get("/filter", filterByDate);

module.exports = router;
