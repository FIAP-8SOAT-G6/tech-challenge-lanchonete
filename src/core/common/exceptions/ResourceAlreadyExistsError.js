const message = "&1 already exists for &2 '&3'";

class ResourceAlreadyExistsError extends Error {
  static Resources = {
    Customer: "Customer"
  };
  constructor(resourceName, attributeName, attributeValue) {
    super(
      message
        .replace("&1", resourceName)
        .replace("&2", attributeName)
        .replace("&3", attributeValue)
    );
  }
}

module.exports = ResourceAlreadyExistsError;
