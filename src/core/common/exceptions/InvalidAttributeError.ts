const message = "&1 '&2' provided is invalid";

export default class InvalidAttributeError extends Error {
  constructor(attributeName: string, attributeValue: any) {
    super(message.replace("&1", attributeName).replace("&2", attributeValue));
  }
}
