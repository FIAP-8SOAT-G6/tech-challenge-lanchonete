import { expect } from "chai";

import { isValidOrderPaymentStatus, OrderPaymentsStatus } from "../../../../core/orders/entities/OrderPaymentsStatus";

describe("Order payment status", () => {
  it("should return true when the given status is an allowed status", () => {
    expect(isValidOrderPaymentStatus(OrderPaymentsStatus.APPROVED)).to.be.true;
  });

  it("should return false when the given status is a disallowed status", () => {
    expect(isValidOrderPaymentStatus("OTHER_STATUS")).to.be.false;
  });
});
