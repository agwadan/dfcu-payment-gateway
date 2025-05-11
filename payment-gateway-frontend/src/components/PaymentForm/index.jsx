import React, { useState } from "react";
import axios from "axios";
import "./PaymentForm.scss";

const PaymentForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    payer: "",
    payee: "",
    amount: "",
    currency: "UGX",
    payerReference: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!/^\d{10}$/.test(formData.payer)) {
      newErrors.payer = "Payer must be exactly 10 digits.";
    }
    if (!/^\d{10}$/.test(formData.payee)) {
      newErrors.payee = "Payee must be exactly 10 digits.";
    }
    if (!/^[A-Z]{3}$/.test(formData.currency.toUpperCase())) {
      newErrors.currency = "Currency must be exactly 3 uppercase letters.";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: null });
    setApiError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setApiError(null);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/payments/initiate",
        formData
      );

      console.log("API Response:", res);

      if (res.data.statusCode === 100 || res.data.statusCode === 200) {
        onSuccess();
      } else {
        setApiError({
          message: res.data?.message || "Transaction failed: Please try again.",
          status: res.status,
        });
      }
    } catch (err) {
      console.error("API Error:", err);

      let errorMessage = "An unexpected error occurred. Please try again.";
      let status = err.response?.status || 500;

      if (err.response) {
        errorMessage = err.response.data?.message;
      } else if (err.request) {
        errorMessage = "No response from server. Please check your connection.";
      }

      setApiError({
        message: errorMessage,
        status: status,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-form">
      <h2>Initiate Payment</h2>

      {apiError && (
        <div className="api-error">
          <p className="error-message">{apiError.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="payer"
          placeholder="Payer Account (10 digits)"
          value={formData.payer}
          onChange={handleChange}
          required
        />
        {errors.payer && <p className="error">{errors.payer}</p>}

        <input
          type="text"
          name="payee"
          placeholder="Payee Account (10 digits)"
          value={formData.payee}
          onChange={handleChange}
          required
        />
        {errors.payee && <p className="error">{errors.payee}</p>}

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="currency"
          placeholder="Currency (e.g., USD)"
          value={formData.currency}
          onChange={handleChange}
          required
        />
        {errors.currency && <p className="error">{errors.currency}</p>}

        <input
          type="text"
          name="payerReference"
          placeholder="Payer Reference (optional)"
          value={formData.payerReference}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Submit Payment"}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
