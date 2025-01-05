const message = "Cannot update order. Order is already finished.";

export default class OrderFinishedError extends Error {
  constructor() {
    super(message);
  }
}
