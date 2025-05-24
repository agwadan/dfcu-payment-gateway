const { v4: uuidv4 } = require("uuid");
const pool = require("../config/db");
const { isValidAccountNumber } = require("../utils/paymentValidator");
const { simulatePaymentOutcome, delay } = require("../utils/helpers");

/*==== Initiate payment ====*/
exports.initiatePayment = async (req, res) => {
  const { payer, payee, amount, currency, payerReference } = req.body;
  const start = Date.now();

  console.log(
    `[INITIATE PAYMENT] Request received at ${new Date().toISOString()}`
  );
  console.log("Payload:", { payer, payee, amount, currency, payerReference });

  if (!isValidAccountNumber(payer) || !isValidAccountNumber(payee)) {
    console.warn("[VALIDATION ERROR] Invalid account number");
    await delay(100);
    return res.status(400).json({
      statusCode: 400,
      message: "Transaction failed ❌: Invalid account number.",
    });
  }

  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    console.warn("[VALIDATION ERROR] Invalid amount");
    await delay(100);
    return res.status(400).json({
      statusCode: 400,
      message: "Transaction failed ❌: Invalid payment amount.",
    });
  }

  if (!currency || currency.length !== 3) {
    console.warn("[VALIDATION ERROR] Invalid currency");
    await delay(100);
    return res.status(400).json({
      statusCode: 400,
      message: "Transaction failed: Invalid currency code.",
    });
  }

  try {
    /* ==== check if payer and payee are in the database ==== */
    const [payeeRows] = await pool.execute(
      `SELECT * FROM users WHERE account_number = ? LIMIT 1`,
      [payee]
    );

    const [payerRows] = await pool.execute(
      `SELECT * FROM users WHERE account_number = ? LIMIT 1`,
      [payer]
    );

    if (payeeRows.length === 0) {
      console.warn("[USER VALIDATION] Payee not found");
      await delay(100);
      return res.status(404).json({
        statusCode: 404,
        message: "Transaction failed ❌: Payee account not found.",
      });
    }

    if (payerRows.length === 0) {
      console.warn("[USER VALIDATION] Payer not found");
      await delay(100);
      return res.status(404).json({
        statusCode: 404,
        message: "Transaction failed ❌: Payer account not found.",
      });
    }

    const transactionReference = uuidv4();
    let status = "PENDING";
    console.log(`[TRANSACTION CREATED] Reference: ${transactionReference}`);

    const insertSql = `INSERT INTO transactions 
      (payer, payee, amount, currency, payer_reference, transaction_reference, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`;

    await pool.execute(insertSql, [
      payer,
      payee,
      amount,
      currency.toUpperCase(),
      payerReference || null,
      transactionReference,
      status,
    ]);
    console.log("[DB INSERT] Transaction inserted");

    status = simulatePaymentOutcome();
    console.log(`[SIMULATION] Payment outcome: ${status}`);

    await pool.execute(
      `UPDATE transactions SET status = ? WHERE transaction_reference = ?`,
      [status, transactionReference]
    );
    console.log("[DB UPDATE] Transaction status updated");

    let response = {
      statusCode: 100,
      transactionReference,
      message: "Transaction Pending",
    };

    if (status === "SUCCESSFUL") {
      response = {
        statusCode: 200,
        transactionReference,
        message: "Transaction successfully processed ✅",
      };
    } else if (status === "FAILED") {
      response = {
        statusCode: 400,
        transactionReference,
        message: "Transaction failed ❌: Processing error",
      };
    }

    const elapsed = Date.now() - start;
    if (elapsed < 100) {
      await delay(100 - elapsed);
    }

    console.log("[RESPONSE SENT]", response);
    return res.status(200).json(response);
  } catch (err) {
    console.error("[SERVER ERROR]", err);
    await delay(100);
    return res.status(500).json({
      statusCode: 500,
      message: "Transaction failed ❌: Internal server error.",
    });
  }
};

/* ==== Check payment status ==== */
exports.checkPaymentStatus = async (req, res) => {
  const { transactionReference } = req.params;
  console.log(`[CHECK STATUS] For transaction: ${transactionReference}`);

  try {
    const [rows] = await pool.execute(
      `SELECT status FROM transactions WHERE transaction_reference = ?`,
      [transactionReference]
    );

    if (rows.length === 0) {
      console.warn("[NOT FOUND] No transaction found");
      return res.status(404).json({
        statusCode: 404,
        message: "Transaction failed ❌: Transaction not found.",
      });
    }

    const status = rows[0].status;
    console.log(`[STATUS FOUND] ${status}`);

    let response = {};
    if (status === "PENDING") {
      response = {
        statusCode: 100,
        message: "Transaction Pending",
      };
    } else if (status === "SUCCESSFUL") {
      response = {
        statusCode: 200,
        message: "Transaction successfully processed ✅",
      };
    } else if (status === "FAILED") {
      response = {
        statusCode: 400,
        message: "Transaction failed ❌: Processing error",
      };
    }

    return res.status(200).json({
      transactionReference,
      ...response,
    });
  } catch (err) {
    console.error("[SERVER ERROR]", err);
    return res.status(500).json({
      statusCode: 400,
      message: "Transaction failed ❌: Internal server error.",
    });
  }
};

/*==== Get all payments ====*/
exports.getAllPayments = async (req, res) => {
  console.log("[GET ALL PAYMENTS] Request received");

  try {
    const [rows] = await pool.execute(
      `SELECT * FROM transactions ORDER BY created_at DESC`
    );
    console.log(`[TRANSACTIONS FETCHED] Count: ${rows.length}`);
    res.status(200).json(rows);
  } catch (err) {
    console.error("[SERVER ERROR]", err);
    res.status(500).json({
      statusCode: 500,
      message: "Failed to fetch transactions.",
    });
  }
};

/*==== Filter by date ====*/
exports.filterByDate = async (req, res) => {
  const { startDate, endDate } = req.body;

  try {
    const [rows] = await pool.execute(
      `SELECT * FROM transactions WHERE created_at BETWEEN ? AND ?`,
      [startDate, endDate]
    );

    res.status(200).json(rows);
  } catch (error) {
    res.status(400).send({
      statusCode: 400,
      message: "There was an error filtering the transactions",
    });
  }
};
