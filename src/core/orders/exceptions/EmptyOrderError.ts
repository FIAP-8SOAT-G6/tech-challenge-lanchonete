const message = "Cannot checkout empty order.";

export default class EmptyOrderError extends Error {
  constructor() {
    super(message);
  }
}
