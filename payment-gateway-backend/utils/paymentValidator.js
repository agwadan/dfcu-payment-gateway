/* ==== Validate 10-digit numeric account number ==== */
const isValidAccountNumber = (num) => /^\d{10}$/.test(num);

/* ==== Validate currency code (3 letters) ==== */
const isValidCurrency = (currency) => /^[A-Z]{3}$/i.test(currency);

module.exports = {
  isValidAccountNumber,
  isValidCurrency,
};
