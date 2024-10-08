const message = "&1 already exists for &2 '&3'";

export default class ResourceAlreadyExistsError extends Error {
  static Resources = {
    Customer: "Customer"
  };
  constructor(
    resourceName: string,
    attributeName: string,
    attributeValue: any
  ) {
    super(
      message
        .replace("&1", resourceName)
        .replace("&2", attributeName)
        .replace("&3", attributeValue)
    );
  }
}


