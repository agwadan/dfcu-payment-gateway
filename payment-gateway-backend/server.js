const express = require("express");
const cors = require("cors");
const app = express();

const paymentRoutes = require("./routes/paymentRoutes");

app.use(express.json());

const allowedOrigin = "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
  })
);

app.use("/api/payments", paymentRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
