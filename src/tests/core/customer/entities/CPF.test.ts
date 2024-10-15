import CPF from "../../../../core/customers/entities/CPF";
import MissingPropertyError from "../../../../core/common/exceptions/MissingPropertyError";
import InvalidAttributeError from "../../../../core/common/exceptions/InvalidAttributeError";

import { expect } from "chai";

describe("CPF Validations", () => {
  it("should not throw an error when validations pass", () => {
    expect(() => new CPF({ cpf: "123.456.789-09" })).to.not.throw();
  });

  it("should throw an error when CPF is not given", () => {
    expect(() => new CPF({ cpf: "" })).to.throw(new MissingPropertyError("cpf").message);
  });

  it("should throw an error when CPF is invalid", () => {
    expect(() => new CPF({ cpf: "123.456.789-10" })).to.throw(InvalidAttributeError);
  });
});
