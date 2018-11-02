const formatStackTrace = require('./formatStackTrace');
const ErrorMap = require('./error_map');
/**
 * Special class for handling exceptions in a more readable
 * and structured way, it is based on Google's API design
 * guidelines for error handling
 *
 * @extends Error
 * @class ResourceError
 * @author Marco Villarreal
 * @since 24/12/2018
 * @version 1.0.0
 */
class ResourceError extends Error {
  /**
   * @constructor
   * @param {Object} param0
   * @param {String} message
   */
  constructor({ status, code }, message) {
    super(message);
    this.name = 'ResourceError';
    this.status = status;
    this.code = code;
    this.message = message;
    this.details = formatStackTrace(this.stack);
    Error.captureStackTrace(this, ResourceError);
  }

  static get ERRORS() {
    return ErrorMap;
  }

  toJSON() {
    const { status, code, message, details } = this;
    return { status, code, message, details };
  }
}

module.exports = ResourceError;
