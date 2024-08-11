const message = "Cannot modify order '&1' with status '&2'.";

class ClosedOrderError extends Error {
  constructor(orderId, status) {
    super(message.replace("&1", orderId).replace("&2", status));
  }
}

module.exports = ClosedOrderError;
