const message = "Cannot checkout empty order.";

class EmptyOrderError extends Error {
  constructor() {
    super(message);
  }
}

module.exports = EmptyOrderError;
