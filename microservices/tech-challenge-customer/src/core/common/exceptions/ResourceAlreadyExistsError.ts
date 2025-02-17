const message = "Customer already exists for &1 '&2'";

export default class ResourceAlreadyExistsError extends Error {
  constructor(attributeName: string, attributeValue: any) {
    super(message.replace("&1", attributeName).replace("&2", attributeValue));
  }
}
