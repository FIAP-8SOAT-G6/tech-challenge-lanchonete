const message = "Missing property '&1'";

export default class MissingPropertyError extends Error {
  constructor(property: string) {
    super(message.replace("&1", property));
  }
}
