class HttpError extends Error {
  constructor(errorMessage, errorCode) {
    super(errorMessage); // Adds a message property to HttpError object
    this.code = errorCode; // Adds a code property 
  }
}

module.exports = HttpError;
