import { HttpStatusCode } from 'axios';

class HttpError extends Error {
  status: number;
  constructor(status: HttpStatusCode, message: string) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export default HttpError;
