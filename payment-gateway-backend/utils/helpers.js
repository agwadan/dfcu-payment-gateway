/*==== Simulate payment outcome ==== */
const simulatePaymentOutcome = () => {
  const random = Math.random() * 100; /* ====> Generate number between 0-100 */
  if (random < 10) {
    return "PENDING"; /* ==============> 10% chance */
  } else if (random < 15) {
    return "SUCCESSFUL"; /* ===============> 5% chance */
  } else {
    return "FAILED"; /* ===========> 85% chance */
  }
};

/*==== Delay function to ensure a minimum response time ==== */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = {
  simulatePaymentOutcome,
  delay,
};
