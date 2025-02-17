import { expect } from "chai";
import CustomerPresenter from "../../presenters/CustomerPresenter";

describe("Customer Presenter", () => {
  it("should return empty object when no customer are found", () => {
    const customer = null;
    const response = CustomerPresenter.adaptCustomerData(customer);
    expect(response).to.be.eql({});
  });

  it("should return empty array when no customers are found", () => {
    const customer = null;
    const response = CustomerPresenter.adaptCustomersData(customer);
    expect(response).to.be.eql([]);
  });
});
