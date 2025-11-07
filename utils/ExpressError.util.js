export default class ExpressError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}


// { status: 400/404/... , message: Page not found/Password Incorrect/User not there please login }