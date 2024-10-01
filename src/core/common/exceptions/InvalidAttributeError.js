const message = "&1 '&2' provided is invalid";

class InvalidAttributeError extends Error {
  constructor(attributeName, attributeValue) {
    super(message.replace("&1", attributeName).replace("&2", attributeValue));
  }
}

module.exports = InvalidAttributeError;
