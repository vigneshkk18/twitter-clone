import { StatusCodes } from "http-status-codes";

import CustomAPIError from "./custom-error";

export default class NotFound extends CustomAPIError {
  constructor(message: string) {
    super(message, StatusCodes.NOT_FOUND);
  }
}
