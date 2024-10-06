const message = "Cannot modify order '&1' with status '&2'.";

export default class ClosedOrderError extends Error {
  constructor(orderId: any, status: string) {
    super(message.replace("&1", orderId).replace("&2", status));
  }
}


