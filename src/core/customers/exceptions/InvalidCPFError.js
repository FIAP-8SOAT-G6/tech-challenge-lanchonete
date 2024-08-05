const message = "CPF '&1' provided is invalid";

class InvalidCPFError extends Error {
  constructor(id) {
    super(message.replace('&1', id));
  }
}

module.exports = InvalidCPFError;
