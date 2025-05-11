import React from "react";
import "./ResultDisplay.scss";

const ResultDisplay = ({ onClose, selectedTransaction }) => {
  return (
    <div className="result-display">
      <div className="modal-content">
        <button className="close" onClick={() => onClose()}>
          X
        </button>
        <h2>Transaction Details</h2>

        <p>
          <strong>Payer:</strong> {selectedTransaction.payer}
        </p>
        <p>
          <strong>Payee:</strong> {selectedTransaction.payee}
        </p>
        <p>
          <strong>Amount:</strong> {selectedTransaction.amount}
        </p>
        <p>
          <strong>Currency:</strong> {selectedTransaction.currency}
        </p>

        <p>
          <strong>Status:</strong> {selectedTransaction.status}
        </p>
        <p>
          <strong>Reference:</strong>{" "}
          {selectedTransaction.transaction_reference}
        </p>
      </div>
    </div>
  );
};

export default ResultDisplay;
