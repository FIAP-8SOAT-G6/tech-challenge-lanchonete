const message = "CPF '&1' provided is invalid";

export default class InvalidCPFError extends Error {
  constructor(cpf: string) {
    super(message.replace("&1", cpf));
  }
}
