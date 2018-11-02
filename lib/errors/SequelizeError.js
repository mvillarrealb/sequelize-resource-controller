const SequelizeErrorHandlers = require('./SequelizeErrorHandlers');
const ERROR_MAP = require('./error_map');
const formatStackTrace = require('./formatStackTrace');
/**
 * SequelizeError represents a custom error
 * class to handle sequelize's exception in
 * a custom way it will parse the error into
 * a known format and extract the stack trace
 * into an pretty format.
 */
class SequelizeError extends Error {
  constructor(originalError) {
    super(originalError.message);
    this.errorHandlers = SequelizeErrorHandlers;
    const { status, code, message, details } = this.handleError(originalError);
    this.status = status;
    this.code = code;
    this.message = message;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Overrides the default toJSON behavior
   * to create a pretty printable json Object
   * @return {Object}
   */
  toJSON() {
    const { status, code, message, details } = this;
    return { status, code, message, details };
  }

  handleError(originalError) {
    let resultingError = {};
    const { name } = originalError;
    if (this.errorHandlers && this.errorHandlers[name]) {
      const errorHandler = this.errorHandlers[name];
      if (typeof errorHandler === 'function') {
        resultingError = errorHandler.call(this, originalError);
      } else if (typeof errorHandler === 'object') {
        const { message, stack } = originalError;
        const { status, code } = errorHandler;
        const details = formatStackTrace(stack);
        resultingError = { status, code, message, details };
      }
    } else if (name === 'ResourceError') {
      resultingError = originalError;
    } else {
      const { message, stack } = originalError;
      const { status, code } = ERROR_MAP.UNKNOWN;
      const details = formatStackTrace(stack);
      resultingError = { status, code, message, details };
    }
    return resultingError;
  }
}

module.exports = SequelizeError;
