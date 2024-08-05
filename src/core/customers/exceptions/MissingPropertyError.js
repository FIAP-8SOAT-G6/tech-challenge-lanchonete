const message = "Missing property '&1'";

class MissingPropertyError extends Error {
  constructor({ property }) {
    super(message.replace("&1", property));
  }
}

module.exports = MissingPropertyError;
