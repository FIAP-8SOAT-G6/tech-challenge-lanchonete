const message = "Missing parameter '&1'";

export default class MissingParameterError extends Error {
  constructor(property: string) {
    super(message.replace("&1", property));
  }
}
