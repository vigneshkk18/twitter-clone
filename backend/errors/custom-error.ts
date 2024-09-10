export default class CustomAPIError extends Error {
  statusCode: number;

  constructor(message: any, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
