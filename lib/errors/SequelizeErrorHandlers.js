const ERROR_MAP = require('./error_map');
/**
 * Defines Sequelize error handling map,
 * on every sequelize's error it will map
 * the corresponding exception to a status code
 * present on error_map.js, except for
 * SequelizeValidationError, on this particular
 * case whe will not use formatStackTrace
 * to extract the detail field, it will
 * extract the errors from the original
 * exception and map them into a new detail
 *
 */
module.exports = {
  SequelizeValidationError: errorObj => {
    const { status, code } = ERROR_MAP.FAILED_PRECONDITION;
    const { message } = 'Validation Failed';
    const details = errorObj.errors.map(err => {
      const { type, message } = err;
      return { type, message };
    });
    return { status, code, message, details };
  },
  SequelizeDatabaseError: ERROR_MAP.INTERNAL,
  SequelizeTimeoutError: ERROR_MAP.UNAVAILABLE,
  SequelizeForeignKeyConstraintError: ERROR_MAP.FAILED_PRECONDITION,
  SequelizeUniqueConstraintError: ERROR_MAP.ALREADY_EXISTS,
  SequelizeConnectionError: ERROR_MAP.UNAVAILABLE,
  SequelizeConnectionRefusedError: ERROR_MAP.UNAVAILABLE,
  SequelizeAccessDeniedError: ERROR_MAP.PERMISSION_DENIED,
  SequelizeHostNotFoundError: ERROR_MAP.INTERNAL,
  SequelizeHostNotReachableError: ERROR_MAP.INTERNAL,
  SequelizeInvalidConnectionError: ERROR_MAP.INTERNAL,
  SequelizeConnectionTimedOutError: ERROR_MAP.INTERNAL,
  SequelizeInstanceError: ERROR_MAP.INTERNAL,
  SequelizeEmptyResultError: ERROR_MAP.INTERNAL,
  SequelizeQueryError: ERROR_MAP.INTERNAL
};
