const validator = require("validator");
const EmailValidator = require("../../../core/customers/ports/validators/EmailValidator");

class EmailValidatorAdapter extends EmailValidator {
  isValid(email) {
    return validator.isEmail(email);
  }
}

module.exports = EmailValidatorAdapter;
