const { cpf } = require("cpf-cnpj-validator");
const CPFValidator = require("../../../core/common/validators/CPFValidator");

class CPFValidatorAdapter extends CPFValidator {
  isValid(cpfValue) {
    return cpf.isValid(cpfValue);
  }
}

module.exports = CPFValidatorAdapter;
