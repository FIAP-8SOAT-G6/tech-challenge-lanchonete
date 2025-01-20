const message = "Cannot change status paid if payment status is not approved";

export default class ForbiddenPaymentStatusChangeError extends Error {
  constructor() {
    super(message);
  }
}
