const message = "&1 not found for &2 '&3'";

export default class ResourceNotFoundError extends Error {
  static Resources = {
    Product: "Product",
    Item: "Item",
    Customer: "Customer",
    Order: "Order"
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

module.exports = ResourceNotFoundError;
