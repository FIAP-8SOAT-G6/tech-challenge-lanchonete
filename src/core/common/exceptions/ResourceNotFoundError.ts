const message = "&1 not found for &2 '&3'";

export default class ResourceNotFoundError extends Error {
  static Resources = {
    Product: "Product",
    Item: "Item",
    Customer: "Customer",
    Order: "Order"
  };

  constructor(resourceName: string, attributeName: string, attributeValue: any) {
    super(
      message
        .replace("&1", resourceName)
        .replace("&2", attributeName)
        .replace("&3", attributeValue)
    );
  }
}


