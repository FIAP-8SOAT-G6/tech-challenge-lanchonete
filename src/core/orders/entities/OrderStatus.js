const OrderStatus = Object.freeze({
  CREATED: "CREATED",
  PENDING_PAYMENT: "PENDING_PAYMENT",
  PAYED: "PAYED",
  RECEIVED: "RECEIVED",
  PREPARING: "PREPARING",
  FINISHED: "FINISHED"
});

module.exports = OrderStatus;
