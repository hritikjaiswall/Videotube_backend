class ApiError extends Error {
  constructor(statusCode,
    MESSAGE="SOMETHING WENT WRONG",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null
    this.message = MESSAGE;
    this.errors = errors;   
    this.success = false;
    if (stack) {
      this.stack = stack;
    }else{
        Error.captureStackTrace(this, this.constructor);
    }
  }
}
export {ApiError}
