import React, { useEffect, useState } from "react";
import axios from "axios";
import PaymentForm from "../components/PaymentForm";
import "./TransactionsList.scss";
import Logo from "/dfcu_logo.png";
import ResultDisplay from "../components/ResultDisplay";

const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/payments/all");
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (tx) => {
    setSelectedTransaction(tx);
  };

  const handleModalClose = () => {
    setShowPaymentForm(false);
    setSelectedTransaction(null);
    fetchTransactions();
  };

  return (
    <div className="transactions-list">
      <img src={Logo} className="logo" alt="DFCU Logo" />
      <div className="header">
        <h2>Transaction History</h2>
        <button onClick={() => setShowPaymentForm(true)}>
          New Transaction
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <div className="table-container">
          <div className="table-header">
            <div className="cell">Payee</div>
            <div className="cell">Amount</div>
            <div className="cell">Currency</div>
            <div className="cell">Status</div>
          </div>

          {transactions.map((tx) => (
            <div
              className="row"
              key={tx.transaction_reference}
              onClick={() => handleRowClick(tx)}
            >
              <div className="cell">{tx.payee}</div>
              <div className="cell">{tx.amount.toLocaleString()}</div>
              <div className="cell">{tx.currency}</div>
              <div className="cell">{tx.status}</div>
            </div>
          ))}
        </div>
      )}

      {/* ==== Payment Form ==== */}
      {showPaymentForm && (
        <div className="modal">
          <div className="modal-content">
            <button className="close" onClick={handleModalClose}>
              X
            </button>
            <PaymentForm onSuccess={handleModalClose} />
          </div>
        </div>
      )}

      {/* ==== Transaction Details ==== */}
      {selectedTransaction && (
        <div className="modal">
          <ResultDisplay
            onClose={handleModalClose}
            selectedTransaction={selectedTransaction}
          />
        </div>
      )}
    </div>
  );
};

export default TransactionsList;
